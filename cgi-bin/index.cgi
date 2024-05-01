#!/usr/bin/python3
import imaplib
import email
from email.header import decode_header
username = open("username.txt", "r").read()
password = open("password.txt", "r").read()

imap = imaplib.IMAP4_SSL("imap.gmail.com")
result = imap.login(username, password)

imap.select("INBOX", 
readonly = True) 

response, messages = imap.search(None, '(UNSEEN)')
messages = messages[0].split()


latest = int(messages[-1])


oldest = int(messages[0])
messages = ""
for i in range(latest, oldest-1, -1):
    res, msg = imap.fetch(str(i), "(RFC822)")
    for response in msg:
        if isinstance(response, tuple):
            message = ""
            msg = email.message_from_bytes(response[1])
            message += msg["Date"] + "\n\n" + msg["From"] + "\n\n" + msg["Subject"] + "\n\n"

            for part in msg.walk():
                content_type = part.get_content_type()

                if content_type == "text/plain":
                    body = part.get_payload(decode=True)
                    print(body)
                    message += f"Body:\n\n \n {body.decode('UTF-8', errors='replace')}"
            messages+=message + "~||~"
imap.close()
imap.logout()
print ("Content-Type: text/html\r\n\r\n")
print(messages[:-4])
