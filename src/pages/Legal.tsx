import { go } from "../router";

export function TermsOfService() {
  return (
    <section className="page">
      <h1>Terms of Service</h1>

      <h2>Acceptance of Terms</h2>
      <p>
        By accessing or using Falfalla Academy, you agree to be bound by these Terms of
        Service. If you do not agree, please do not use our platform.
      </p>

      <h2>User Accounts</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account
        credentials. You must provide accurate information when creating an account and
        keep it up to date. You may not share your account with others.
      </p>

      <h2>Course Access</h2>
      <p>
        Enrolled courses are available for personal, non-commercial use only. Access to
        course materials is granted for the duration specified at the time of purchase.
        Falfalla Academy reserves the right to update or discontinue course content at any
        time.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All course content, including videos, text, images, and assessments, is the
        property of Falfalla Academy and its instructors. You may not reproduce, distribute,
        or create derivative works without prior written permission.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        Falfalla Academy provides educational content on an "as is" basis. We are not liable
        for any direct, indirect, or consequential damages arising from your use of the
        platform or reliance on course materials.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions about these terms, please reach out to us at{" "}
        legal@falfalla-academy.com.
      </p>

      <button className="primary" onClick={() => go({ name: "home" })}>
        Back to home
      </button>
    </section>
  );
}

export function PrivacyPolicy() {
  return (
    <section className="page">
      <h1>Privacy Policy</h1>

      <h2>Data We Collect</h2>
      <p>
        We collect information you provide when creating an account, such as your name,
        email address, and payment details. We also collect usage data including pages
        visited, course progress, and device information.
      </p>

      <h2>How We Use Your Data</h2>
      <p>
        Your data is used to provide and improve our services, personalize your learning
        experience, process payments, and communicate important updates about your account
        or courses.
      </p>

      <h2>Cookies</h2>
      <p>
        Falfalla Academy uses cookies and similar technologies to remember your preferences,
        keep you signed in, and analyze how our platform is used. You can manage cookie
        preferences through your browser settings.
      </p>

      <h2>Third Parties</h2>
      <p>
        We may share limited data with trusted third-party services for payment
        processing, analytics, and email delivery. We do not sell your personal information
        to third parties.
      </p>

      <h2>Your Rights</h2>
      <p>
        You have the right to access, correct, or delete your personal data. You may also
        request a copy of the data we hold about you. To exercise these rights, contact us
        using the information below.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy-related inquiries, please email us at privacy@falfalla-academy.com.
      </p>

      <button className="primary" onClick={() => go({ name: "home" })}>
        Back to home
      </button>
    </section>
  );
}
