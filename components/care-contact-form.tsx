'use client';

import { useState, type FormEvent } from 'react';

export function CareContactForm() {
  const [reviewed, setReviewed] = useState(false);

  function reviewEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReviewed(true);
  }

  return (
    <form className="care-contact-form" method="dialog" onSubmit={reviewEnquiry} onChange={() => setReviewed(false)} aria-describedby="contact-preview-note">
      <p id="contact-preview-note" className="care-notice">Private preview. Try the form with sample details. Enquiries are not sent or saved.</p>
      <div className="care-form-fields">
        <label>
          Full Name
          <input type="text" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          Email Address
          <input type="email" autoComplete="email" required maxLength={254} />
        </label>
        <label>
          Enquiry Subject
          <input type="text" required maxLength={180} />
        </label>
        <label>
          Order Number (Optional)
          <input type="text" autoComplete="off" maxLength={80} />
        </label>
        <label className="care-form-full">
          Your Message
          <textarea rows={5} required maxLength={3000} />
        </label>
      </div>
      <div className="care-submit-row">
        <button className="button button-dark" type="submit">Send Enquiry <span aria-hidden="true">→</span></button>
        <p role="status">{reviewed ? 'The preview form is complete. Your enquiry has not been sent or saved.' : ''}</p>
      </div>
    </form>
  );
}
