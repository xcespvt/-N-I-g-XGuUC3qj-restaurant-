
import Header from "@/components/landing/header";


export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="bg-background rounded-2xl shadow-lg overflow-hidden border border-border/50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-8 md:p-12 text-center border-b border-border/30">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                CREVINGS FOOD PARTNER REFUND POLICY
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                <em>Effective Date: 11 November 2025</em>
              </p>
            </div>

            {/* Content */}
            <div className="p-6 md:p-10">
              <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-li:marker:text-primary">
                <p className="lead">
                  This document outlines the official Refund Policy of CREVINGS MARKETPLACE PRIVATE LIMITED (hereinafter referred to as the "Company," "we," "us," or "our"). It governs refund eligibility, conditions, and procedures applicable to payments made by registered Food Partners.
                </p>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">1. SCOPE AND APPLICABILITY</h2>
                  <h3 className="text-xl font-semibold text-foreground mt-6">1.1. Applicable Payments</h3>
                  <p className="mt-4">This Refund Policy applies strictly to payments made by Partners to Crevings for the following categories:</p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Monthly or recurring subscription fees</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Ad Wallet top-ups and other advertising credits</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Add-ons or feature activations within the Partner Platform</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Software or hardware purchases made directly from Crevings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Food material or merchandise procured from Crevings for Partner use</span>
                    </li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6">1.2. Acknowledgment</h3>
                  <p className="mt-4">By onboarding as a Crevings Food Partner and making such payments, you expressly acknowledge and agree to the terms of this Refund Policy.</p>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">2. GENERAL PRINCIPLE</h2>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>All payments made by Food Partners to the Company are non-refundable, except in cases explicitly defined within this Policy.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Refunds shall be processed only where a verified failure or error is directly attributable to Crevings' systems, operations, or internal processes.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Voluntary purchases, activations, or top-ups initiated successfully by Partners are not eligible for refund unless otherwise specified herein.</span>
                    </li>
                  </ul>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">3. ELIGIBLE SCENARIOS FOR REFUND</h2>
                  <p className="mt-4">Refunds may be issued only under the following circumstances, subject to internal verification and approval:</p>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6">3.1. Duplicate Payment</h3>
                  <p className="mt-2">If a Partner is inadvertently charged twice for the same transaction, subscription, or service, the duplicate amount shall be refunded.</p>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6">3.2. Failed Transaction (Technical Error)</h3>
                  <p className="mt-2">If a payment was deducted but not successfully reflected in the Partner's Crevings Account or Wallet due to a confirmed system or gateway failure.</p>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6">3.3. Service Non-Activation</h3>
                  <p className="mt-2">If a purchased feature (e.g., subscription plan, ad wallet, or add-on) was not activated or made accessible due to a technical or operational issue within Crevings' control, and the Partner notifies Crevings within seven (7) days of payment.</p>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">4. NON-REFUNDABLE TRANSACTIONS</h2>
                  <p className="mt-4">The following payment types are strictly non-refundable under all circumstances:</p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Successfully activated subscriptions or plans</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Voluntary wallet top-ups made by Partners</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Ad campaigns or promotions that have begun, even partially</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Refund requests initiated after seven (7) days from the date of payment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Purchases of hardware, merchandise, or food material once delivered or collected</span>
                    </li>
                  </ul>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">5. REFUND REQUEST PROCEDURE</h2>
                  <p className="mt-4">To initiate a refund request, Partners must:</p>
                  <ol className="list-decimal pl-6 mt-4 space-y-2">
                    <li>Contact their assigned Relationship Manager, or</li>
                    <li>Email support@crevings.com with the subject line: "Refund Request – [Restaurant Name]"</li>
                  </ol>
                  <p className="mt-4">Each request must include:</p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Proof of payment (transaction ID, payment date, and amount)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Description of the issue and justification for refund</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Supporting documents or screenshots as evidence</span>
                    </li>
                  </ul>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">6. PROCESSING AND TIMELINES</h2>
                  <h3 className="text-xl font-semibold text-foreground mt-6">6.1. Acknowledgement</h3>
                  <p className="mt-2">Crevings shall acknowledge refund requests within three (3) working days of receipt.</p>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6">6.2. Investigation</h3>
                  <p className="mt-2">A detailed review shall be completed within seven (7) to ten (10) working days.</p>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6">6.3. Refund Execution</h3>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Approved refunds will be processed within five (5) to seven (7) business days thereafter.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Refunds shall be made via the original payment method or credited to the Partner's Crevings Wallet, as applicable.</span>
                    </li>
                  </ul>
                  <p className="mt-4 italic">Note: In genuine cases, most Partners receive refunds within one (1) to three (3) working days of approval.</p>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">7. WALLET BALANCE AND AD CREDITS</h2>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>7.1</strong> Funds added to the Partner Ad Wallet are treated as advance credits for future Crevings services, specifically advertising and marketing campaigns.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>7.2</strong> Once utilized (even partially), wallet credits are not eligible for refund or reversal.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>7.3</strong> However, if no portion of the wallet amount has been used within seven (7) days of top-up, the Partner may request a full refund, subject to verification.</span>
                    </li>
                  </ul>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">8. DISPUTE RESOLUTION</h2>
                  <h3 className="text-xl font-semibold text-foreground mt-6">8.1. Escalation Process</h3>
                  <p className="mt-2">In case of disagreement or dissatisfaction with a refund outcome, the Partner may escalate the matter to:</p>
                  <p className="mt-2 font-medium">📧 legal@crevings.com</p>
                  <p className="mt-2">with the subject line: "Refund Appeal – [Restaurant Name]"</p>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6">8.2. Final Decision</h3>
                  <p className="mt-2">All such appeals will be reviewed by the Crevings Partner Operations and Legal Team. The decision of Crevings on such matters shall be final and binding.</p>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">9. POLICY UPDATES AND NOTIFICATION</h2>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>9.1</strong> The Company reserves the right to modify, amend, or replace this Refund Policy at any time without prior notice.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>9.2</strong> The latest version will always be accessible through the Crevings Partner Portal.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>9.3 Notification of Updates:</strong> Whenever this Policy is updated, all active Food Partners will be informed via:</span>
                      <ul className="ml-6 mt-2 space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2">-</span>
                          <span>Push notification in the Partner App</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">-</span>
                          <span>WhatsApp message</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">-</span>
                          <span>Official email communication</span>
                        </li>
                      </ul>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>9.4</strong> Continued use of Crevings' services following such updates constitutes acceptance of the revised Refund Policy.</span>
                    </li>
                  </ul>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">10. CONTACT INFORMATION</h2>
                  <p className="mt-4">For all refund or billing-related queries:</p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>📧 legal@crevings.com</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>📞 Partner Helpline (available in Partner App under Help & Support)</span>
                    </li>
                  </ul>
                </section>

                <div className="mt-12 pt-6 border-t border-border/50 text-sm text-muted-foreground">
                  <p>Last updated: 19 November 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}
