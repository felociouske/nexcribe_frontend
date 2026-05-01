import LegalPage, { Section, Clause, InfoBox } from '../../components/layout/LegalPage'
import Footer from '../../components/layout/Footer'

export default function WithdrawalPolicy() {
  return (
    <LegalPage
      title="Withdrawal Policy"
      subtitle="This policy explains how earnings withdrawals work on Nexcribe, including limits, processing times and what happens when a withdrawal is rejected."
      icon="💸"
      lastUpdated="January 2026"
    >
      <InfoBox icon="✅" title="Withdrawals are fast" color="teal">
        Most withdrawal requests are processed within 30 minutes on business days. The minimum
        withdrawal is KES 240 and funds are sent directly to your M-Pesa.
      </InfoBox>

      <Section title="1. Eligible Wallets">
        <Clause number="1.1" title="Account Wallet">
          Earnings from writing jobs, transcription tasks, games and wheel spins are credited
          to your Account Wallet. These funds are available for withdrawal.
        </Clause>
        <Clause number="1.2" title="Yields Wallet">
          Referral commissions are credited to your Yields Wallet. These funds are also
          available for withdrawal.
        </Clause>
        <Clause number="1.3" title="Deposit Wallet — not withdrawable">
          Funds in your Deposit Wallet are used for purchasing plans only and cannot be
          withdrawn to M-Pesa. Only the earnings wallets (Account and Yields) support withdrawals.
        </Clause>
        <Clause number="1.4" title="Cashback Wallet">
          The Cashback Wallet is a reward wallet. Cashback funds may be transferred to your
          Account Wallet for withdrawal at the admin's discretion during promotional periods.
        </Clause>
      </Section>

      <Section title="2. Withdrawal Limits">
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-navy-50">
                <th className="text-left px-4 py-3 font-display font-bold text-navy-700 rounded-tl-xl">Limit</th>
                <th className="text-left px-4 py-3 font-display font-bold text-navy-700">Amount</th>
                <th className="text-left px-4 py-3 font-display font-bold text-navy-700 rounded-tr-xl">Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Minimum withdrawal', 'KES 240 (~$2)', 'Per request'],
                ['Maximum per request', 'No limit', 'Subject to available balance'],
                ['Max pending requests', '1 per wallet', 'Per wallet at a time'],
                ['Processing time', '30 minutes', 'Business days'],
              ].map(([col1, col2, col3], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-navy-50/50'}>
                  <td className="px-4 py-3 text-navy-700 font-medium">{col1}</td>
                  <td className="px-4 py-3 text-teal-700 font-bold">{col2}</td>
                  <td className="px-4 py-3 text-navy-500">{col3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="3. How to Withdraw">
        <div className="space-y-3">
          {[
            { step: '01', title: 'Go to Wallet page', desc: 'Navigate to Dashboard → Wallet. You will see your Account and Yields wallet balances.' },
            { step: '02', title: 'Click Withdraw', desc: 'Click the Withdraw button on the wallet you want to withdraw from.' },
            { step: '03', title: 'Enter amount and method', desc: 'Enter the amount in USD and choose M-Pesa or card. Provide your phone number or card details.' },
            { step: '04', title: 'Submit request', desc: 'Submit the request. Your balance moves from "Available" to "Pending" immediately.' },
            { step: '05', title: 'Admin processes payment', desc: 'An admin reviews and sends the payment within 30 minutes. You will be notified by in-app notification and email.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4 p-4 rounded-xl bg-navy-50/50 border border-navy-100">
              <span className="w-10 h-10 rounded-xl bg-teal-600 text-white font-display font-bold text-sm flex items-center justify-center flex-shrink-0">
                {step}
              </span>
              <div>
                <p className="font-display font-semibold text-navy-800 text-sm">{title}</p>
                <p className="text-navy-500 text-sm mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="4. Approval and Rejection">
        <Clause number="4.1" title="Approved withdrawals">
          When approved, funds are sent to your M-Pesa or card within the same business day.
          A M-Pesa receipt number is recorded for your reference. An in-app notification
          and email are sent with the receipt details.
        </Clause>
        <Clause number="4.2" title="Rejected withdrawals">
          If a withdrawal is rejected by an admin, the full amount is automatically returned
          to your wallet balance immediately. The rejection reason is visible in your
          withdrawal history and sent via notification. No funds are lost on rejection.
        </Clause>
        <Clause number="4.3" title="Reasons for rejection">
          Common reasons for rejection include: unverified payment details, suspected fraud,
          account under review, or incorrect phone number. The admin will provide a remark
          explaining the reason.
        </Clause>
      </Section>

      <Section title="5. Exchange Rate">
        <p>
          Withdrawals are calculated at a fixed rate of <strong>KES 120 = $1 USD</strong>.
          The USD amount you enter is converted to KES for M-Pesa payment at this rate.
          The rate applied is the one current at the time of withdrawal approval.
        </p>
      </Section>

      <Section title="6. Incorrect Payment Details">
        <p>
          Nexcribe is not responsible for funds sent to incorrect M-Pesa numbers or bank
          account details provided by the user. Always verify your payment details carefully
          before submitting a withdrawal. In the event of an error please contact us
          immediately at{' '}
          <a href="mailto:nexcribe@gmail.com" className="text-teal-600 hover:underline">
            nexcribe@gmail.com
          </a>{' '}
          — recovery is not guaranteed.
        </p>
      </Section>

      <Section title="7. Taxation">
        <p>
          Users are responsible for understanding and complying with any tax obligations
          arising from earnings on Nexcribe in their jurisdiction. Nexcribe does not
          withhold taxes and does not provide tax advice.
        </p>
      </Section>

      <Section title="8. Contact">
        <p>
          For withdrawal disputes or questions contact{' '}
          <a href="mailto:nexcribe@gmail.com" className="text-teal-600 hover:underline">
            nexcribe@gmail.com
          </a>{' '}
          with your transaction code and a description of the issue. We respond within
          24 hours on business days.
        </p>
      </Section>
    </LegalPage>
  )
}