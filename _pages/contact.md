---
layout: single
title: "Contact"
permalink: /contact/
author_profile: false
---

Heeft u een vraag of opmerking? Vul dan onderstaand formulier in en ik neem zo snel mogelijk contact met u op.

<form id="contact-form" action="https://hook.eu1.make.com/1vcvgttjf3wnycjyehwpp4f7181jtyxp" method="POST">
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
  // Dit script zorgt voor een naadloze verzending en doorverwijzing naar de bedankpagina
  const form = document.getElementById('contact-form');
  form.addEventListener("submit", function(e) {
    e.preventDefault(); 
    const data = new FormData(form);
    const submitButton = document.getElementById('submit-button');
    
    // Visuele feedback voor de gebruiker
    submitButton.disabled = true;
    submitButton.innerText = "Bezig met verzenden...";

    fetch(form.action, {
      method: form.method,
      body: data,
    }).then(response => {
      // Ongeacht het antwoord, stuur door naar de bedankpagina voor een soepele ervaring
      window.location.href = "/bedankt/";
    }).catch(error => {
      // Ook bij een fout, stuur door om de gebruiker niet te laten hangen
      window.location.href = "/bedankt/";
    });
  });
</script>
