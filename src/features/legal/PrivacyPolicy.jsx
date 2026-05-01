import LegalPage, { Section, Clause, InfoBox } from '../../components/layout/LegalPage'

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="Your privacy matters to us. This policy explains what data we collect, how we use it, and your rights."
      icon="🔒"
      lastUpdated="January 2026"
    >
      <InfoBox icon="🔒" title="Your data is safe" color="teal">
        Nexcribe does not sell your personal data to third parties. We collect only what is necessary
        to operate the platform and process your payments.
      </InfoBox>

      <Section title="1. Data We Collect">
        <Clause number="1.1" title="Account information">
          When you register we collect your name, email address, phone number, and username.
          This information is used to create and manage your account.
        </Clause>
        <Clause number="1.2" title="Payment information">
          For deposits and withdrawals we collect M-Pesa phone numbers and transaction codes.
          We do not store full card numbers. Payment processing is handled securely.
        </Clause>
        <Clause number="1.3" title="Usage data">
          We collect data about how you interact with the platform including tasks completed,
          games played, and pages visited. This helps us improve the service.
        </Clause>
        <Clause number="1.4" title="Device information">
          We may collect your IP address, browser type, and device type for security and
          fraud prevention purposes.
        </Clause>
      </Section>

      <Section title="2. How We Use Your Data">
        <div className="space-y-2">
          {[
            'To create and manage your account',
            'To process deposits, plan purchases and withdrawals',
            'To send you notifications about your tasks, earnings and account activity',
            'To detect and prevent fraud and abuse',
            'To improve the platform based on usage patterns',
            'To respond to your support requests',
            'To send you important service updates (you cannot opt out of these)',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-teal-500 font-bold mt-0.5">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="3. Data Sharing">
        <Clause number="3.1" title="No selling of data">
          Nexcribe does not sell, rent or trade your personal data to any third party for
          marketing or any other purpose.
        </Clause>
        <Clause number="3.2" title="Service providers">
          We share limited data with trusted service providers who help us operate the platform,
          including email delivery services and payment processors. These providers are bound
          by confidentiality agreements.
        </Clause>
        <Clause number="3.3" title="Legal requirements">
          We may disclose your data if required to do so by law or in response to valid requests
          from public authorities including courts and government agencies in Kenya.
        </Clause>
      </Section>

      <Section title="4. Data Retention">
        <p>
          We retain your account data for as long as your account is active. If you close your
          account we will delete your personal data within 90 days, except where we are required
          to retain it for legal or financial compliance purposes (such as transaction records
          which may be retained for up to 7 years).
        </p>
      </Section>

      <Section title="5. Security">
        <p>
          We use industry-standard security measures including encrypted connections (HTTPS),
          hashed passwords and secure token-based authentication (JWT). However, no method of
          transmission over the internet is 100% secure and we cannot guarantee absolute security.
        </p>
        <p className="mt-3">
          If you suspect your account has been compromised please contact us immediately at{' '}
          <a href="mailto:nexcribe@gmail.com" className="text-teal-600 hover:underline">
            nexcribe@gmail.com
          </a>.
        </p>
      </Section>

      <Section title="6. Your Rights">
        <Clause number="6.1" title="Access">
          You may request a copy of the personal data we hold about you by contacting our support team.
        </Clause>
        <Clause number="6.2" title="Correction">
          You may update most of your personal information directly from your Profile page in the dashboard.
        </Clause>
        <Clause number="6.3" title="Deletion">
          You may request deletion of your account and associated data by contacting support.
          Note that transaction records may be retained as required by law.
        </Clause>
        <Clause number="6.4" title="Objection">
          You may object to certain processing of your data by contacting us. We will respond
          within 14 days.
        </Clause>
      </Section>

      <Section title="7. Cookies">
        <p>
          Nexcribe uses session cookies to keep you logged in and local storage to save your
          preferences. We do not use advertising or third-party tracking cookies. You can
          clear cookies at any time from your browser settings, though this will log you out.
        </p>
      </Section>

      <Section title="8. Contact">
        <p>
          For privacy-related concerns or requests contact our Data Protection Officer at{' '}
          <a href="mailto:privacy@nexcribe.com" className="text-teal-600 hover:underline">
            privacy@nexcribe.com
          </a>.
        </p>
      </Section>
    </LegalPage>
  )
}