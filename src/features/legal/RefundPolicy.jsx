import LegalPage, { Section, Clause, InfoBox } from '../../components/layout/LegalPage'

export default function RefundPolicy() {
  return (
    <LegalPage
      title="Refund Policy"
      subtitle="We want to be transparent about when refunds are and are not available on the Nexcribe platform."
      icon="💰"
      lastUpdated="January 2026"
    >
      <InfoBox icon="⚠️" title="Please read before purchasing" color="amber">
        All plan purchases on Nexcribe are generally non-refundable once activated. Please review
        your plan selection carefully before completing a purchase.
      </InfoBox>

      <Section title="1. Plan Purchases">
        <Clause number="1.1" title="No refunds on activated plans">
          Once a plan has been purchased and activated - meaning the task pool has become
          accessible to you - the purchase is final and cannot be refunded.
        </Clause>
        <Clause number="1.2" title="Technical error refunds">
          If a plan was purchased due to a verified technical error on Nexcribe's side (for example,
          a double charge or a plan activating incorrectly), we will review the case and issue
          a credit to your Deposit Wallet within 5 business days.
        </Clause>
        <Clause number="1.3" title="Upgrade credits">
          When you upgrade to a higher plan in the same category, no credit is issued for
          the previous plan. The previous plan is marked expired and the new plan activates.
        </Clause>
      </Section>

      <Section title="2. Deposits">
        <Clause number="2.1" title="Pending deposits">
          If you submitted a deposit request that has not yet been approved, you may contact
          support to cancel it. The M-Pesa funds will not be returned by Nexcribe as they
          were sent directly via M-Pesa — contact Safaricom if a payment was sent in error.
        </Clause>
        <Clause number="2.2" title="Approved deposits">
          Once a deposit has been approved and credited to your Deposit Wallet, it cannot be
          reversed or refunded back to M-Pesa. The funds remain in your Deposit Wallet and
          can be used to purchase any available plan.
        </Clause>
        <Clause number="2.3" title="Rejected deposits">
          If your deposit is rejected (for example, because the M-Pesa code was invalid),
          no funds were ever credited to Nexcribe.
        </Clause>
      </Section>

      <Section title="3. Earnings Withdrawals">
        <Clause number="3.1" title="Approved withdrawals">
          Once a withdrawal has been approved and sent to your M-Pesa, it cannot be reversed.
        </Clause>
        <Clause number="3.2" title="Rejected withdrawals">
          If your withdrawal request is rejected by an admin, the full amount is automatically
          returned to your wallet balance. No funds are lost.
        </Clause>
        <Clause number="3.3" title="Wrong payment details">
          Nexcribe is not responsible for funds sent to incorrect M-Pesa numbers or card details
          provided by the user. Always double-check your payment details before submitting a
          withdrawal request.
        </Clause>
      </Section>

      <Section title="4. How to Request a Review">
        <p>
          If you believe you are entitled to a refund or credit based on the circumstances
          described above, please contact us within 7 days of the transaction at{' '}
          <a href="mailto:nexcribe@gmail.com" className="text-teal-600 hover:underline">
            nexcribe@gmail.com
          </a>{' '}
          with:
        </p>
        <div className="mt-3 space-y-2">
          {[
            'Your registered email address',
            'The transaction code from your wallet history',
            'A clear description of the issue',
            'Any supporting evidence (screenshots, M-Pesa confirmation)',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-teal-500 font-bold">→</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="mt-4">
          All refund requests are reviewed within 5–7 business days. Our decision is final.
        </p>
      </Section>
    </LegalPage>
  )
}