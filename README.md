# AI Email Sorter || Apr. 2024
This project uses the Gemeni API and IMAP to collect your unread emails, and use AI to rank and sort them on how urgent they are.
## Directions:
To utilize this, you will need to create three text files in the repository.
- "username.txt", which contains your gmail, but WITHOUT the @gmail.com segment. For example, if your gmail is johndoe77@gmail.com, in username.txt it should say johndoe77 .
- "password.txt", which contains your Application Password. Note that this is NOT THE SAME as your gmail password. To create an app password, go to https://myaccount.google.com/security , turn on 2FA, then visit https://myaccount.google.com/apppasswords and create one. Then copy-paste it directly into passwords.txt.
- "api-key.txt", which contains your Gemeni API KEY. To generate an API KEY, go to https://ai.google.dev/gemini-api/docs/api-key . Copy paste your key into the text file.

You will also need to turn on IMAP in your GMAIL settings. You can do that here: https://mail.google.com/mail/u/0/#settings/fwdandpop 
