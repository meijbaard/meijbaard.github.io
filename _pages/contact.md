---
layout: single
title: "Contact"
permalink: /contact/
author_profile: false
---

Heeft u een vraag of opmerking? Vul dan onderstaand formulier in en ik neem zo snel mogelijk contact met u op.

<form id="contact-form" action="https://formspree.io/f/mwpqzjab" method="POST">
  <div style="margin-bottom: 15px;">
    <label for="name">Naam:</label><br>
    <input type="text" id="name" name="name" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
  </div>
  
  <div style="margin-bottom: 15px;">
    <label for="email">E-mailadres:</label><br>
    <input type="email" id="email" name="_replyto" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
  </div>
  
  <div style="margin-bottom: 15px;">
    <label for="message">Bericht:</label><br>
    <textarea id="message" name="message" required rows="6" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
  </div>
  
  <div>
    <button id="submit-button" type="submit" style="padding: 10px 20px; border: none; background-color: #52adc8; color: white; cursor: pointer; border-radius: 4px;">Verzenden</button>
  </div>
</form>

<script>
async function handleSubmit(event) {
  event.preventDefault();
  var form = event.target;
  var data = new FormData(form);
  var submitButton = document.getElementById('submit-button');

  // Visuele feedback voor de gebruiker
  submitButton.disabled = true;
  submitButton.innerText = "Bezig met verzenden...";

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: {
          'Accept': 'application/json'
      }
    });

    if (response.ok) {
      // Alles ging goed, stuur door
      window.location.href = "/bedankt/";
    } else {
      // Formspree geeft een fout terug
      const responseData = await response.json();
      if (Object.hasOwn(responseData, 'errors')) {
        alert("Fout: " + responseData["errors"].map(error => error["message"]).join(", "));
      } else {
        alert("Er is een onbekende fout opgetreden bij het verzenden.");
      }
      // Heractiveer de knop
      submitButton.disabled = false;
      submitButton.innerText = "Verzenden";
    }
  } catch (error) {
    // Netwerk of andere fout
    alert("Verzenden mislukt. Controleer uw internetverbinding.");
    // Heractiveer de knop
    submitButton.disabled = false;
    submitButton.innerText = "Verzenden";
  }
}

const form = document.getElementById('contact-form');
form.addEventListener("submit", handleSubmit);
</script>
