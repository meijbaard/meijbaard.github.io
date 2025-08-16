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
async function handleSubmit(event) {
  event.preventDefault();
  var form = event.target;
  var data = new FormData
