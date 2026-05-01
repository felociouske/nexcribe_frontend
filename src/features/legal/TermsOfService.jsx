import LegalPage, { Section, Clause, InfoBox } from '../../components/layout/LegalPage'

export default function TermsOfService() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle="Please read these terms carefully before using Nexcribe. By creating an account or using any part of the platform you agree to be bound by these terms."
      icon="📋"
      lastUpdated="January 2026"
    >
      <InfoBox icon="⚠️" title="Important" color="amber">
        These terms constitute a legally binding agreement between you and Nexcribe Ltd. If you do not agree
        to any part of these terms you must not use the platform.
      </InfoBox>

      <Section title="1. About Nexcribe">
        <p>
          Nexcribe is an online earning platform operated by Nexcribe Ltd, a company based in the UK, branched to Kenya.
          The platform provides users with opportunities to earn money by completing writing tasks,
          transcribing audio content, playing skill-based games, and spinning a reward wheel.
        </p>
        <p>
          Nexcribe does not guarantee any specific level of income. Earnings depend entirely on the
          user's activity, skill, and the availability of tasks on the platform.
        </p>
      </Section>

      <Section title="2. Eligibility">
        <Clause number="2.1" title="Age requirement">
          You must be at least 18 years old to create an account and use the platform. By registering
          you confirm that you meet this requirement.
        </Clause>
        <Clause number="2.2" title="One account per person">
          Each person may hold only one account. Creating multiple accounts to gain unfair advantages
          will result in permanent suspension of all associated accounts.
        </Clause>
        <Clause number="2.3" title="Accurate information">
          You must provide accurate and truthful information during registration. Nexcribe reserves
          the right to suspend accounts where false information is detected.
        </Clause>
      </Section>

      <Section title="3. Plans and Payments">
        <Clause number="3.1" title="One-time purchase">
          All plans are one-time purchases. There are no monthly fees or automatic renewals.
          Once purchased a plan remains active on your account until you upgrade.
        </Clause>
        <Clause number="3.2" title="Payment via Deposit Wallet">
          Plan purchases are deducted from your Deposit Wallet. You must first deposit funds
          via M-Pesa before purchasing any plan.
        </Clause>
        <Clause number="3.3" title="No refunds on activated plans">
          Once a plan has been activated and tasks have become accessible, the purchase is final
          and non-refundable. Please refer to our Refund Policy for more details.
        </Clause>
        <Clause number="3.4" title="Upgrading plans">
          You may upgrade to a higher level plan within the same category at any time. The previous
          plan will be marked expired. Upgrade fees are not prorated.
        </Clause>
      </Section>

      <Section title="4. Earning and Withdrawals">
        <Clause number="4.1" title="Task completion">
          Earnings are credited to your Account Wallet only after a submitted task is reviewed
          and approved by the Nexcribe treasurey. Submission does not guarantee payment.
        </Clause>
        <Clause number="4.2" title="Minimum withdrawal">
          The minimum withdrawal amount is KES 240 (approximately $2 USD). Withdrawal requests
          are processed within 20mins of withdrawal.
        </Clause>
        <Clause number="4.3" title="Withdrawal methods">
          Withdrawals are processed via M-Pesa or bank card. You must provide accurate payment
          details. Nexcribe is not liable for funds sent to incorrect details provided by the user.
        </Clause>
        <Clause number="4.4" title="Daily earnings caps">
          Gaming and wheel plans have daily earning caps as specified on each plan's detail page.
          Caps reset at midnight Nairobi time (EAT).
        </Clause>
      </Section>

      <Section title="5. Prohibited Conduct">
        <p>The following actions are strictly prohibited and will result in immediate account suspension:</p>
        <div className="mt-3 space-y-2">
          {[
            'Submitting plagiarised, AI-generated or copied writing content',
            'Using automated tools, bots or scripts to complete tasks or play games',
            'Submitting falsified transcriptions or deliberately inaccurate work',
            'Creating multiple accounts or sharing accounts',
            'Attempting to exploit bugs or vulnerabilities in the platform',
            'Engaging in fraud, chargebacks or deceptive payment behaviour',
            'Harassing other users or Nexcribe staff',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">✕</span>
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="6. Account Suspension and Termination">
        <Clause number="6.1" title="Nexcribe's rights">
          Nexcribe reserves the right to suspend or permanently terminate any account at its
          discretion if these terms are violated. No refund will be issued for suspended accounts
          where a terms violation is determined.
        </Clause>
        <Clause number="6.2" title="User-initiated closure">
          You may close your account at any time by contacting nexcribe@gmail.com. Pending
          earnings at the time of closure will be reviewed and may be forfeited depending on
          the reason for closure.
        </Clause>
      </Section>

      <Section title="7. Intellectual Property">
        <p>
          All content, branding, logos, and platform design are the property of Nexcribe Ltd
          and may not be copied, reproduced, or distributed without written permission.
          Writing content submitted by users on the platform becomes the property of the
          client who commissioned the task upon payment.
        </p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>
          Nexcribe provides the platform on an "as is" basis. We do not guarantee uninterrupted
          access. To the fullest extent permitted by law, Nexcribe Ltd is not liable for any
          indirect, incidental or consequential damages arising from use of the platform,
          including lost earnings due to technical issues or task rejection.
        </p>
      </Section>

      <Section title="9. Changes to Terms">
        <p>
          Nexcribe reserves the right to update these terms at any time. Continued use of the
          platform after changes are published constitutes acceptance of the updated terms.
          Significant changes will be notified via in-app notification.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          For questions about these terms please contact us at{' '}
          <a href="mailto:nexcribe@gmail.com" className="text-teal-600 hover:underline">
            nexcribe@gmail.com
          </a>
          . Our support team responds within 24 hours on business days.
        </p>
      </Section>
    </LegalPage>
  )
}