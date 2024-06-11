import sys
import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
import json
import os
from datetime import datetime
from subprocess import check_output

# Firebase Admin SDKの初期化
cred = credentials.Certificate('/Users/frontier_tai/Desktop/Nextjs/DoctorRecomend/server/doctorrecomend-firebase-adminsdk-sth3q-7dd1e5316a.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

def search_hospital(Loc, Sp, Lv):
    try:
        csv_path = 'judgment/hospital.csv'
        df = pd.read_csv(csv_path)
        Alphabet = ['A地区', 'B地区', 'C地区', 'D地区', 'E地区']
        pri = [['A地区', 'D地区', 'E地区', 'B地区', 'C地区'],
               ['B地区', 'A地区', 'E地区', 'D地区', 'C地区'],
               ['C地区', 'D地区', 'B地区', 'A地区', 'E地区'],
               ['D地区', 'A地区', 'E地区', 'C地区', 'B地区'],
               ['E地区', 'A地区', 'D地区', 'B地区', 'C地区']]
        j = Alphabet.index(Loc)
        for i in range(5):
            df_empty = df[df['Location'].str.contains(pri[j][i]) & 
                          (df['Expertise_Level'] >= Lv) & 
                          df['Specialty'].str.contains(Sp)]
            
            if not df_empty.empty:
                df_empty = df_empty.reset_index()
                print(f"Found hospital: {df_empty['Hospital'][0]}", file=sys.stderr)
                return df_empty['Hospital'][0], df_empty['Location'][0], df_empty['Doctor_Name'][0], int(df_empty['Expertise_Level'][0]), df_empty['Specialty'][0]
        
        return None
    except Exception as e:
        print(f"Error in search_hospital: {e}", file=sys.stderr)
        return None

def get_firestore_data_and_search():
    try:
        doc_ref = db.collection('rooms').document('PeGTHlBbhMJC2wIRtzfM').collection('Input').order_by('timestamp', direction=firestore.Query.DESCENDING).limit(1)
        docs = doc_ref.stream()

        for doc in docs:
            data = doc.to_dict()
            print(f"Retrieved Firestore data: {data}", file=sys.stderr)
            Age = data.get('Age')
            Location = data.get('Location')
            Parts = data.get('Parts')
            Severity = data.get('Severity')
            timestamp = data.get('timestamp')
            image_path = data.get('ImagePath')

            result = search_hospital(Location, Parts, Severity)
            #ファイアストアに保存
            if result:
                if isinstance(timestamp, firestore.SERVER_TIMESTAMP.__class__):
                    data['timestamp'] = timestamp.to_datetime()

                return result, data, image_path, doc.reference, timestamp

        print("No data found in Firestore", file=sys.stderr)
        return None, None, None, None, None
    except Exception as e:
        print(f"Error fetching data from Firestore: {e}", file=sys.stderr)
        return None, None, None, None, None

def convert_to_serializable(data):
    """Converts Firestore data to a JSON serializable format."""
    for key, value in data.items():
        if isinstance(value, datetime):
            data[key] = value.isoformat()
        elif isinstance(value, firestore.DocumentReference):
            data[key] = value.path
        elif isinstance(value, dict):
            data[key] = convert_to_serializable(value)
    return data

def run_yolov5(image_path):
    """Runs the YOLOv5 model and returns the path to the output image."""
    try:
        result = check_output(['python', '/Users/frontier_tai/Desktop/Nextjs/DoctorRecomend/server/yolo/yolov5_script.py', image_path])
        result_json = json.loads(result)
        print(f'YOLOv5 result: {result_json}', file=sys.stderr)
        return result_json.get("output_path")
    except Exception as e:
        print(f"Error running YOLOv5 script: {e}", file=sys.stderr)
        return None

def save_recommendation_to_firestore(result, input_data, yolo_result_path, timestamp):
    try:
        if not result:
            print(json.dumps({"error": "No result found"}))
            return

        Hospital, Location, Doctor_Name, Expertise_Level, Specialty = result

        room_doc_ref = db.collection("rooms").document("PeGTHlBbhMJC2wIRtzfM")
        message_collection_ref = room_doc_ref.collection("Output")

        data = {
            'Hospital': Hospital,
            'Location': Location,
            'Doctor_Name': Doctor_Name,
            'Expertise_Level': int(Expertise_Level),  # numpy.int64をPythonのintに変換
            'Specialty': Specialty,
            'InputData': input_data,
            'YOLO_Result_Path': yolo_result_path,
            'Time_Stamp': timestamp
        }

        serializable_data = convert_to_serializable(data)
        print(f"Saving data to Firestore: {serializable_data}", file=sys.stderr)
        message_collection_ref.add(serializable_data)
        
    except Exception as e:
        print(f"Error saving recommendation to Firestore: {e}", file=sys.stderr)

result, input_data, image_path, doc_ref, timestamp = get_firestore_data_and_search()
print(f"Firestore data and search result: {result}, {input_data}, {image_path}", file=sys.stderr)
input_data['doc_ref'] = doc_ref
yolo_result_path = run_yolov5(image_path) if image_path else None
print(f"YOLO result path: {yolo_result_path}", file=sys.stderr)

save_recommendation_to_firestore(result, input_data, yolo_result_path, timestamp)
