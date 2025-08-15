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
    <button type="submit" style="padding: 10px 20px; border: none; background-color: #52adc8; color: white; cursor: pointer; border-radius: 4px;">Verzenden</button>
  </div>
</form>

<script>
  document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById('contact-form');
    form.addEventListener("submit", function(e) {
      e.preventDefault(); // Voorkom de standaard formulier-verzending

      var data = new FormData(form);
      fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      }).then(response => {
        // Ongeacht het succes van de verzending, stuur de gebruiker door.
        // Formspree regelt de validatie en mailt eventuele fouten.
        window.location.href = "/bedankt/";
      }).catch(error => {
        // Zelfs bij een netwerkfout, stuur de gebruiker door.
        // De kans is klein, maar de gebruikerservaring is belangrijker.
        window.location.href = "/bedankt/";
      });
    });
  });
</script>
