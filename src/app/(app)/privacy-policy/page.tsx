
import Header from "@/components/landing/header";


export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="bg-background rounded-2xl shadow-lg overflow-hidden border border-border/50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-8 md:p-12 text-center border-b border-border/30">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                CREVINGS - PRIVACY POLICY
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                <em>Effective Date: 07 November 2025</em>
              </p>
            </div>

            {/* Content */}
            <div className="p-6 md:p-10">
              <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-li:marker:text-primary">
                <p className="lead">
                  This Privacy Policy outlines how CREVINGS MARKETPLACE PRIVATE LIMITED collects, processes, and protects personal data in accordance with applicable data protection laws.
                </p>
                <p>
                  By using our services and platforms, you consent to the collection and processing of your personal data as described in this policy.
                </p>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">1. COMPANY INFORMATION AND JURISDICTION</h2>
                  <h3 className="text-xl font-semibold text-foreground mt-6">1.1. Data Fiduciary Designation</h3>
                  <p className="mt-4">CREVINGS MARKETPLACE PRIVATE LIMITED declares itself the primary Data Fiduciary responsible for determining the purposes and means of processing personal data as applicable under law.</p>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6">1.2. Contact & Support</h3>
                  <p className="mt-4">The Company has established dedicated communication channels for Food Partners and Data Principals to raise queries, exercise data rights, or report issues related to data protection.</p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Email: legal@crevings.com</span>
                    </li>
                  </ul>
                  <p className="mt-4">Communications to the Company's support contact shall be acknowledged within fifteen (15) working days, and a substantive response or resolution will be provided within thirty (30) working days, subject to identity verification and lawful constraints.</p>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6">1.3. Governing Legal Framework</h3>
                  <p className="mt-4">This Privacy Policy shall be governed by the substantive and procedural laws of the Republic of India, including without limitation the Digital Personal Data Protection Act, 2023 (DPDP Act), the Information Technology Act, 2000, and all associated rules and subordinate legislation. All disputes arising from or in relation to this Policy shall be subject to the exclusive jurisdiction of the courts situated within the National Capital Territory of Delhi, India.</p>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">2. SCOPE OF THIS POLICY AND DATA PRINCIPALS</h2>
                  <p>This Policy pertains to all natural and juridical persons whose data is processed by the Company ("Data Principals"), including but not limited to:</p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Food Partner Representatives (Proprietary Data Principals):</strong> Owners, directors, authorized signatories, and other representatives providing KYC and KYB documentation during onboarding and compliance verification.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Food Partner Staff (Accessory Data Principals):</strong> Employees and agents whose login credentials and role-based access permissions are furnished to the Company by the Food Partner for secure use of Partner-facing interfaces.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Food Partner Entity (Juridical Data Principal):</strong> The commercial entity (e.g., restaurant, cloud kitchen, café, franchise) whose non-personal corporate and operational data is collected and archived.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Partner's Customers (Offline Subordinate Data Principals):</strong> End-customers whose data is provided to the Company by the Food Partner for the purposes of executing marketing campaigns and related services; in such cases the Food Partner remains the primary Data Fiduciary and the Company acts as Data Processor insofar as it processes such customer records.</span>
                    </li>
                  </ul>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">3. INFORMATION WE COLLECT AND RETAIN</h2>
                  <p>The Company collects, processes, and retains a comprehensive corpus of information necessary to provide services and fulfill legal obligations. Categories include, but are not limited to:</p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Identity & Compliance Data (KYC/KYB):</strong> Aadhaar, PAN (where applicable), GST registration, Corporate Identification Number (CIN), FSSAI License Number, registered legal address, official legal entity name, and financial instrument particulars (bank account details) required for verification, statutory compliance, and settlement.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Operational & Location Data:</strong> Internal system identifiers (e.g., restaurant_id), trade/display names, full physical addresses, geocoordinates (latitude/longitude), declared operating hours, establishment classification (e.g., cloud kitchen, dine-in, café), photographic and video assets of premises, logos, and described amenities.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Contact & Access Credentials:</strong> Proprietor and authorized user names, primary business telephone numbers, verified email addresses, and other access-related identifiers used for secure credentialing, account notifications, and administrative communication.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Financial & Transactional Data:</strong> Order-level transaction records, revenue metrics, payout banking details, payout disbursement histories, and ancillary financial data maintained for payment execution, accounting, taxation, and statutory reporting.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Food Partner Staff Data:</strong> Employee identifiers, role/titles, business contact information, securely hashed authentication credentials, and assigned application access permissions.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Inventory & Menu Data:</strong> Comprehensive menu enumerations, stock and inventory levels, consumption and ordering histories, item categorization, and transactional behavior contributing to predictive analytics and inventory forecasting.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Aggregated & Derived Performance Metrics:</strong> Offline sales reports as reported by Partners, temporal demand analyses, best-selling item indicators, inferred customer demographic approximations, and aggregated statistics generated for performance improvement and automated campaign targeting. Such derived data may be aggregated and anonymized for analytic uses.</span>
                    </li>
                  </ul>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">4. LEGAL BASIS AND PURPOSE(S) OF PROCESSING</h2>
                  <p>Personal data is processed for legitimate, specific, and documented purposes, including:</p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Onboarding & Regulatory Compliance:</strong> Verification of Partner identity and credentials to satisfy KYC/KYB obligations and comply with FSSAI, GST, taxation, and other regulatory reporting requirements.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Service Delivery & Operational Support:</strong> Maintenance of marketplace visibility, order management, delivery routing (utilizing geocoordinates), customer support, technical maintenance, and provision of core platform functionality.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Financial Settlement & Reporting:</strong> Execution of accurate payout disbursements, maintenance of ledgers, reconciliation, statutory accounting, and tax filings.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Business Analysis, Advisory & Optimization:</strong> Combine inventory/menu, transactional, and offline performance data to diagnose operational deficiencies, recommend menu engineering, pricing strategies, inventory procurement improvements, and other prescriptive enhancements to augment Partner competitiveness.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Staff Management & Security:</strong> Administer role-based access controls and secure authentication for Partner staff, as authorized by the Food Partner.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Marketing Campaigns (Processor Role):</strong> Where the Company processes Partner-supplied customer data to execute marketing campaigns, the Company acts as Data Processor and processes such data strictly per Partner instructions and contractual Data Processing Agreements.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Algorithmic Enhancement & Product Improvement:</strong> Use of aggregated, anonymized data subsets to improve internal analytics, predictive models, and proprietary algorithmic services. Such usage shall exclude identifiable personal data unless specific consent has been obtained.</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-primary/5 border-l-4 border-primary">
                    <p className="font-semibold text-foreground"><strong>Important Disclosure:</strong> The Company shall utilize specific restaurant and menu data supplied by Food Partners to display such information on the Crevings Consumer App for customer discovery, ordering, and engagement. By onboarding as a Food Partner, Proprietary Data Principals provide explicit consent for such display and marketing usage.</p>
                    <p className="mt-2"><strong>Assurance:</strong> The Company expressly disavows the sale of personal data for monetization, the sharing of Partner-specific proprietary datasets with direct competitors, or the use of Partner-instrumented data to launch competing commercial entities. Data usage is strictly bounded by the declared purposes herein.</p>
                  </div>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">5. DATA SHARING, DISCLOSURE, AND INTERCHANGE</h2>
                  <p>The Company shall not disclose personal data to external parties except as necessary for service delivery, under lawful compulsion, or pursuant to protective contractual safeguards:</p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Third-Party Service Providers:</strong> Minimal data necessary for payment settlement and financial processing may be shared with regulated banks, payment gateways, and authorized financial intermediaries bound by confidentiality and contractual data protection obligations.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Affiliates & Group Entities:</strong> Aggregated or anonymized analytical data may be shared with the Company's affiliates, subsidiaries, or group companies for operational planning and product development, subject to equivalent protective commitments.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Legal & Regulatory Disclosure:</strong> Personal data may be disclosed in response to legally enforceable orders, valid governmental or judicial requests, or regulatory investigations where disclosure is required by law.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Corporate Transactions:</strong> In the event of a merger, acquisition, reorganization, or sale of assets, personal data may be transferred to the successor entity under contractual assurances that the receiving party will adhere to privacy obligations materially equivalent to those in this Policy, and where required, Data Principals will be notified as required by law.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Cross-Border Processing & Storage:</strong> Personal data is primarily stored on secure infrastructure within the territorial jurisdiction of India. Where processing or storage outside India is necessary (for instance, use of global cloud infrastructure), the Company shall ensure the implementation of protections equivalent to those required under applicable law and shall disclose such transfers in accordance with regulatory standards.</span>
                    </li>
                  </ul>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">6. DATA RETENTION AND DESTRUCTION</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Retention Principle:</strong> Personal data will be retained only for the period necessary to fulfil the lawful purpose for which it was collected, or as required for compliance with statutory obligations (whichever is longer).</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Post-Contract Retention Period:</strong> Certain categories of data, notably financial records, KYC/KYB documentation, and tax-related records, shall be retained for a period of seven (7) years following the cessation of the contractual relationship or account termination, or for such longer period as required by applicable law.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Deletion & Destruction:</strong> Upon expiration of the retention period, data will be disposed of securely using irreversible cryptographic erasure for electronic records and physical shredding for hard-copy documents. The Company shall maintain auditable deletion logs to evidence compliance with destruction obligations.</span>
                    </li>
                  </ul>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">7. CONSENT, RIGHTS, AND WITHDRAWAL</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Consent:</strong> By providing personal data or by continuing to use the Company's services and platforms, Data Principals consent to the collection and processing of their personal data in accordance with this Policy and the lawful bases herein described.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Withdrawal of Consent:</strong> Data Principals may withdraw consent at any time by sending an explicit request to support@crevings.com, subject to verification and the Company's legal obligations. Upon valid withdrawal, the Company shall cease relevant processing within a commercially reasonable timeframe unless retention is required by law.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Data Subject Rights:</strong> Data Principals may exercise rights of access, rectification, erasure, portability, objection to processing, and grievance by contacting support@crevings.com. Requests shall be acknowledged within fifteen (15) working days and substantively addressed within thirty (30) working days, unless extension is warranted by complexity or legal constraint, in which case the Company will communicate the reasons for delay and the expected resolution timeframe.</span>
                    </li>
                  </ul>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">8. PROCESSING OF CHILDREN'S PERSONAL DATA</h2>
                  <p>The Company does not knowingly solicit, collect, or process personal data of children under the age of eighteen (18) years. In the event that the Company becomes aware that personal data of a minor has been collected without verifiable parental or guardian consent, the Company shall promptly delete such data from its active systems and take reasonable steps to notify the relevant Partner or Data Principal, where ascertainable, and to purge such records from backups in accordance with lawful constraints.</p>
                  <p className="mt-4"><strong>Age Restriction for Food Partner Onboarding:</strong> Individuals under 18 years of age are strictly prohibited from being onboarded as Crevings Food Partners, restaurant operators, franchise participants, or any merchant category within the Crevings Partner ecosystem.</p>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">9. DATA SECURITY AND BREACH PROTOCOL</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Security Controls:</strong> The Company implements reasonable technical and organisational measures to secure personal data, including encryption at rest and in transit, role-based access control, multi-factor authentication for privileged accounts, secure coding practices, network perimeter defenses, and periodic security audits and assessments.</span>
                    </li>
                  </ul>
                  <p className="mt-4">In the event of a material personal data breach, the Company will promptly initiate containment, forensic analysis, and mitigation measures. Where required by law, the Company shall notify the relevant regulatory authority (including the Data Protection Board of India) and the affected Data Principals without undue delay and provide information regarding the nature of the breach, the categories of data affected, the remedial actions taken, and recommended mitigation steps for affected individuals. All such incidents will be logged and reviewed to effectuate corrective controls.</p>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">10. POLICY UPDATES AND VERSIONING</h2>
                  <p>The Company reserves the right to amend this Privacy Policy at any time to reflect changes in legal requirements, operational practices, or technological developments. Material modifications will be denoted by an updated Effective Date and shall be published on the Company's official website.</p>
                  <p className="mt-4"><strong>Notification of Updates:</strong> Whenever the Privacy Policy is updated, all registered Food Partners shall be informed through push notifications within the Partner App, WhatsApp messages, and official email communication.</p>
                  <p className="mt-4">Continued use of the Company's services following such updates constitutes acceptance of the revised Policy.</p>
                </section>

                <section className="mt-12">
                  <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">11. CONTACT AND COMMUNICATION</h2>
                  <p>For inquiries, complaints, or to exercise your data rights, contact:</p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Email: support@crevings.com</span>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    
    </div>
  );
}

    