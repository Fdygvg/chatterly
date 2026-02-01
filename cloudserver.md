Ok for the cloud bucket + file storage these are  all in the .env file
AWS_ACCESS_KEY_ID= 
AWS_SECRET_ACCESS_KEY
AWS_REGION=eu-north-1
AWS_S3_BUCKET_NAME=chatterlly
MAX_UPLOAD_SIZE=10485760



first every input i want it to go throught the following security checks 


**File Upload Security Checklist:**

1. **Extension Whitelist** - Allow only know file types `.jpg`, `.png`,.js, .json,.yaml, .ts, .tsx.....

2. **MIME Type Validation** - Check file's actual content type
3. **File Size Limits** - Prevent DoS with large files
4. **Filename Sanitization** - Remove dangerous characters

5. **Content Validation** - Verify file is valid (e.g., real image)
8. **Metadata Removal** - Strip EXIF/GPS data
9. **Rate Limiting** - Prevent mass uploads
