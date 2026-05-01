import LegalPage, { Section, Clause, InfoBox } from '../../components/layout/LegalPage'

export default function DepositAgreement() {
  return (
    <LegalPage
      title="Deposit Agreement"
      subtitle="This agreement governs all deposits made to the Nexcribe platform via M-Pesa. By submitting a deposit you confirm that you have read and accept these terms."
      icon="🏦"
      lastUpdated="January 2026"
    >
      <InfoBox icon="📱" title="How Deposits Work" color="teal">
        All deposits are processed manually. You send money via M-Pesa to our verified deposit Agents, submit the confirmation
        code on the platform, and an agent verifies and approves within 5 minutes after depositing. Funds are
        then credited to your Deposit Wallet.
      </InfoBox>

      <Section title="1. Deposit Process">
        <Clause number="1.1" title="Step 1 — Send via M-Pesa">
          Send the desired amount to the official Nexcribe deposit agent number
          displayed in the app. Always use the correct number and name confirmation
          to ensure your payment is traceable.
        </Clause>
        <Clause number="1.2" title="Step 2 — Submit on Nexcribe">
          After sending, go to Dashboard → Wallet → Deposit and submit your M-Pesa
          confirmation code, the phone number used, and the amount. All three fields must
          match the actual M-Pesa transaction exactly.
        </Clause>
        <Clause number="1.3" title="Step 3 — Admin verification">
          An agent will verify your transaction against M-Pesa records and approve or reject
          it within 5 minutes after depositing. You will receive an in-app notification and email when the
          status changes.
        </Clause>
        <Clause number="1.4" title="Step 4 — Funds credited">
          Once approved, the KES amount is credited to your Deposit Wallet at the current
          exchange rate (KES 120 = $1). These funds can only be used to purchase plans.
        </Clause>
      </Section>

      <Section title="2. Deposit Rules">
        <Clause number="2.1" title="Minimum deposit">
          The minimum deposit is KES 100. There is no maximum deposit limit.
        </Clause>
        <Clause number="2.2" title="One submission per transaction">
          Each M-Pesa confirmation code may only be submitted once. Attempting to submit the
          same code multiple times will result in rejection and may trigger a fraud review.
        </Clause>
        <Clause number="2.3" title="Accurate details required">
          The amount, phone number and M-Pesa code submitted must exactly match the actual
          M-Pesa transaction. Discrepancies will result in rejection.
        </Clause>
        <Clause number="2.4" title="Deposit Wallet purpose">
          Funds in your Deposit Wallet are used exclusively to purchase Nexcribe plans.
          They cannot be withdrawn directly back to M-Pesa. Only earnings in your Account
          Wallet or Yields Wallet can be withdrawn.
        </Clause>
      </Section>

      <Section title="3. Exchange Rate">
        <p>
          Deposits are converted from KES to USD at a fixed rate of <strong>KES 120 = $1 USD</strong>.
          This rate is set by Nexcribe and may be updated with 7 days notice. The rate at
          the time of deposit approval applies. Exchange rate changes do not retroactively
          affect funds already in your wallet.
        </p>
      </Section>

      <Section title="4. Rejected Deposits">
        <Clause number="4.1" title="Reasons for rejection">
          Deposits may be rejected if the M-Pesa code is invalid, already used, the amount
          doesn't match, or fraud is suspected.
        </Clause>
        <Clause number="4.2" title="Funds not received by Nexcribe">
          A rejection means Nexcribe was unable to verify the payment. Nexcribe cannot trace or recover funds sent
          to incorrect numbers.
        </Clause>
        <Clause number="4.3" title="Disputing a rejection">
          If you believe a valid deposit was incorrectly rejected, contact{' '}
          <a href="mailto:nexcribe@gmail.com" className="text-teal-600 hover:underline">
            nexcribe@gmail.com
          </a>{' '}
          within 48 hours with your M-Pesa confirmation message screenshot.
        </Clause>
      </Section>

      <Section title="5. Fraud Prevention">
        <p>
          Nexcribe actively monitors for fraudulent deposit submissions. Any attempt to submit
          fake M-Pesa codes, manipulate transaction amounts, or exploit the deposit system
          will result in immediate and permanent account suspension without refund. Legal
          action may be pursued where applicable under Kenyan law.
        </p>
      </Section>

      <Section title="6. Agreement Confirmation">
        <p>
          By submitting a deposit on the Nexcribe platform you confirm that:
        </p>
        <div className="mt-3 space-y-2">
          {[
            'You have genuinely sent the stated amount via M-Pesa',
            'The M-Pesa code, phone number and amount are accurate',
            'You understand that deposited funds are used for plan purchases only',
            'You accept that approved deposits cannot be refunded',
            'You agree to these deposit terms and Nexcribe\'s Terms of Service',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-teal-500 font-bold mt-0.5">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Section>
    </LegalPage>
  )
}