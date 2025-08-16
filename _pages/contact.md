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
  document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById('contact-form');
    var submitButton = document.getElementById('submit-button');

    form.addEventListener("submit", function(e) {
      e.preventDefault(); // Voorkom de standaard formulier-verzending

      // Toon een 'verzenden...' status aan de gebruiker
      submitButton.disabled = true;
      submitButton.innerText = "Bezig met verzenden...";

      var data = new FormData(form);
      fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          // Verzending gelukt! Stuur nu door.
          window.location.href = "/bedankt/";
        } else {
          // Er ging iets mis bij Formspree. Geef een foutmelding.
          response.json().then(data => {
            if (Object.hasOwn(data, 'errors')) {
              alert(data["errors"].map(error => error["message"]).join(", "));
            } else {
              alert("Er is een onbekende fout opgetreden. Probeer het later opnieuw.");
            }
            // Heractiveer de knop
            submitButton.disabled = false;
            submitButton.innerText = "Verzenden";
          })
        }
      }).catch(error => {
        // Er ging iets mis met de netwerkverbinding.
        alert("Verzenden mislukt. Controleer uw internetverbinding en probeer het opnieuw.");
        // Heractiveer de knop
        submitButton.disabled = false;
        submitButton.innerText = "Verzenden";
      });
    });
  });
</script>
