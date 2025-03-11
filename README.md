# 📄 Job Application Processing Pipeline

A full-stack web application for processing job applications, uploading CVs to cloud storage, extracting key information, and storing data in Google Sheets.

---

## 🚀 Live Demo  
🔗 [Live Form](https://jobapplicationpipeline.netlify.app/)

---

## 🛠️ Tech Stack  
- Frontend:HTML, CSS, JavaScript  
- Backend:Node.js 
- Cloud Storage:Supabase  
- Database:Google Sheets (for processed CV data)  

---

## 📂 Features  
- Job Application Form- 
  - Collects applicant name, email, phone number, and CV (PDF/DOCX).  
  - Uploads CVs to Supabase storage and generates a public link.  

- CV Processing-
  - Extracts key information (like name and contact details) from CV filenames.  
  - Stores the extracted data in a Google Sheet.  

- Webhook Integration- 
  - Sends an HTTP request to the provided endpoint after processing each CV.  

---

## 📊 Processed Data (Google Sheet)  
🔗 [View Processed CV Data](https://docs.google.com/spreadsheets/d/1KI9rehvJGtrn2NjLT6A61DjhLue3cT-CIM4_8yQxoHg/edit?usp=sharing)**

---

## 📜 Project Architecture  
1. Frontend- Collects user data and uploads CVs via a form.  
2. Backend-  
   - Handles file uploads and saves CVs in Supabase.  
   - Extracts data and updates Google Sheets.  
   - Sends a webhook request after successful processing.  
---

## 🚩 Future Improvements  
- Send a follow-up email to applicants after submission.  
- Use a free API or library to extract detailed information like education and qualifications.  
- Add better error messages and form validation.  
