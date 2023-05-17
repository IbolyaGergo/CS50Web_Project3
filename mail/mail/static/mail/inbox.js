document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#compose-form').onsubmit = send_email;

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      // console.log(emails);

      
      // ... do something else with emails ...
      emails.forEach(email => {
        const div = document.createElement('div');
        div.style.border = 'thin solid black';

        if (email.read) {
          div.style.backgroundColor = 'gray';
        } else {
          div.style.backgroundColor = 'white';
        }

        div.classList.add('row');
        document.querySelector('#emails-view').append(div);
        
        const sender_col = document.createElement('div');
        sender_col.classList.add('col-sm-4');
        sender_col.innerHTML = `<strong>${email.sender}</strong>`;
        div.appendChild(sender_col);

        const subject_col = document.createElement('div');
        subject_col.classList.add('col-sm-4');
        subject_col.innerHTML = `${email.subject}`;
        div.appendChild(subject_col);

        const timestamp_col = document.createElement('div');
        timestamp_col.classList.add('col-sm-4');
        timestamp_col.style.textAlign = 'right';
        timestamp_col.innerHTML = `${email.timestamp}`;
        div.appendChild(timestamp_col);
        // document.querySelector('#emails-view').innerHTML = `<h3>${email}</h3>`;
        // div.innerHTML = `<strong>${email.sender}</strong>` + ' ' + `${email.body}`;
        // console.log(email.sender);
      });
  });
}

function send_email() {
  // console.log('Hello');
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  // console.log(compose_recipients, compose_subject, compose_body);

  fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
  })
  .then(response => response.json())
  .then(result => {
          load_mailbox('sent');
      });
  // load_mailbox('sent');
  return false;
}