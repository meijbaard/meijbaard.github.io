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
  
  <div class="g-recaptcha" data-sitekey="6Lc_wKcrAAAAAGS4J2TW9abGVOnWULJVI71k81CF"></div>
  <br>
  
  <div>
    <button id="submit-button" type="submit" style="padding: 10px 20px; border: none; background-color: #52adc8; color: white; cursor: pointer; border-radius: 4px;">Verzenden</button>
  </div>
</form>

<script src="https://www.google.com/recaptcha/api.js" async defer></script>

<script>
window.addEventListener("load", function() {
  const form = document.getElementById('contact-form');
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const data = new FormData(form);
    const action = e.target.action;
    const submitButton = document.getElementById('submit-button');
    
    // Visuele feedback
    submitButton.disabled = true;
    submitButton.innerText = "Bezig met verzenden...";

    fetch(action, {
      method: 'POST',
      body: data,
      headers: {
          'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        // Succes! Stuur door naar de bedankpagina.
        window.location.href = '/bedankt/';
      } else {
        response.json().then(data => {
          if (Object.hasOwn(data, 'errors')) {
            // Specifieke foutmelding van Formspree, vaak "reCAPTCHA validation failed"
            alert(data["errors"].map(error => error["message"]).join(", "));
          } else {
            alert("Er is een fout opgetreden. Controleer of de reCAPTCHA is aangevinkt.");
          }
          // Heractiveer de knop
          submitButton.disabled = false;
          submitButton.innerText = "Verzenden";
          // Belangrijk: reset de reCAPTCHA zodat de gebruiker het opnieuw kan proberen
          grecaptcha.reset();
        })
      }
    }).catch(error => {
      alert("Verzenden mislukt. Controleer uw internetverbinding.");
      submitButton.disabled = false;
      submitButton.innerText = "Verzenden";
      grecaptcha.reset();
    });
  });
});
</script>
