---
layout: single
title: "Contact"
pagetitle: "Neem contact op met mij"
description: "Heb je een vraag, opmerking of wil je in gesprek gaan? Neem direct contact op via het formulier. Ik hoor graag van je."
permalink: /contact/
author_profile: false
---

Heeft u een vraag of opmerking? Vul dan onderstaand formulier in en ik neem zo snel mogelijk contact met u op.

<form id="contact-form" action="https://hook.eu1.make.com/1vcvgttjf3wnycjyehwpp4f7181jtyxp" method="POST">
  <!-- Honeypot: onzichtbaar voor mensen, bots vullen dit veld wel in -->
  <div style="position: absolute; left: -9999px;" aria-hidden="true">
    <label for="website">Website (niet invullen)</label>
    <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
  </div>
  <input type="hidden" id="form-loaded-at" name="form_loaded_at" value="">

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
  
  <!-- CLOUDFLARE TURNSTILE WIDGET -->
  <div class="cf-turnstile" data-sitekey="0x4AAAAAAEFjtV-o7ev4_Mhu" data-language="nl"></div>
  <br>
  
  <div>
    <button id="submit-button" type="submit" class="btn btn--primary">Verzenden</button>
  </div>
</form>

<!-- CLOUDFLARE TURNSTILE SCRIPT -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

<script>
  // Dit script zorgt voor een naadloze verzending en doorverwijzing naar de bedankpagina
  const form = document.getElementById('contact-form');
  document.getElementById('form-loaded-at').value = Date.now();

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    // Blokkeer verzenden zolang de Turnstile-check niet is afgerond
    const turnstileToken = form.querySelector('[name="cf-turnstile-response"]');
    if (!turnstileToken || !turnstileToken.value) {
      alert("Een moment geduld a.u.b. — de anti-spamcontrole is nog niet afgerond.");
      return;
    }

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
