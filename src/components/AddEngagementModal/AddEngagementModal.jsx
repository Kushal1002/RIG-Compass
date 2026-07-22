import { useState, useEffect, useRef } from 'react';
import {
  X, ChevronLeft, ChevronRight, Check, Search, CheckCircle, Loader,
  Building2, DollarSign, FileText, Sparkles, Upload, Link
} from 'lucide-react';
import { lookupCustomer } from '../../services/api';
import styles from './AddEngagementModal.module.css';

const INDUSTRIES = [
  'Technology', 'Manufacturing', 'Financial Services', 'Retail',
  'Automotive', 'Energy & Utilities', 'Healthcare & Life Sciences',
  'Public Sector', 'Telecommunications',
];

const REGIONS = ['EMEA', 'APJ', 'NA', 'LATAM', 'MEE'];

const COUNTRIES = [
  'Germany', 'United States', 'United Kingdom', 'India', 'France',
  'Japan', 'Australia', 'Switzerland', 'Netherlands',
];

const SEGMENTS = ['Enterprise', 'SME', 'Public Sector', 'Startup'];

const LINE_OF_BUSINESS = [
  'Finance & Accounting', 'Supply Chain', 'Human Resources',
  'Sales & Distribution', 'Procurement', 'Manufacturing', 'IT & Technology',
];

const TIMELINES = ['1–3 months', '3–6 months', '6–12 months', '12+ months'];

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const JOULE_CAPABILITIES = [
  'Joule for Developers', 'Joule for HR', 'Joule for Finance',
  'Joule for Customer Experience', 'Joule for Supply Chain',
  'Joule for IT Operations', 'Joule for Procurement', 'Joule for Sales',
  'Joule Studio Custom Skills', 'Joule Studio Workflows',
];

const EXT_LINK_TYPES = ['GitHub', 'Jira', 'SharePoint', 'Confluence', 'Other'];

const STEPS = [
  { num: 1, label: 'Customer & Contacts' },
  { num: 2, label: 'Opportunity' },
  { num: 3, label: 'Documents' },
  { num: 4, label: 'Review' },
];

const empty = {
  // Step 1 — Customer Info
  crmAccountId:      '',
  customerName:      '',
  industry:          '',
  region:            '',
  country:           '',
  accountTeam:       '',
  customerSegment:   '',
  // Step 1 — Contacts
  sponsorName:       '',
  sponsorTitle:      '',
  sponsorEmail:      '',
  sponsorPhone:      '',
  techContactName:   '',
  techContactTitle:  '',
  techContactEmail:  '',
  techContactPhone:  '',
  // Step 2 — Opportunity
  projectName:       '',
  problemStatement:  '',
  lineOfBusiness:    '',
  timeline:          '3–6 months',
  jouleCapabilities: [],
  businessValue:     50,
  strategicImportance: 50,
  priority:          'Medium',
  isReferenceCustomer: false,
  // Step 3 — Documents
  extLinkType:       'GitHub',
  extLinkUrl:        '',
  // notes
  notes:             '',
};

export default function AddEngagementModal({ onAdd, onClose, currentUser }) {
  const [step, setStep]          = useState(1);
  const [form, setForm]          = useState(empty);
  const [errors, setErrors]      = useState({});
  const [lookupState, setLookup] = useState('idle');
  const [crmMeta, setCrmMeta]    = useState(null);
  const [files, setFiles]        = useState([]);
  const fileInputRef             = useRef(null);
  const debounceRef              = useRef(null);

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const toggleCapability = (cap) => {
    setForm(prev => ({
      ...prev,
      jouleCapabilities: prev.jouleCapabilities.includes(cap)
        ? prev.jouleCapabilities.filter(c => c !== cap)
        : [...prev.jouleCapabilities, cap],
    }));
  };

  // Debounced CRM ID lookup
  useEffect(() => {
    const id = form.crmAccountId.trim();
    if (!id) { setLookup('idle'); setCrmMeta(null); return; }

    clearTimeout(debounceRef.current);
    setLookup('loading');
    debounceRef.current = setTimeout(async () => {
      try {
        const customer = await lookupCustomer(id);
        if (customer) {
          setForm(prev => ({
            ...prev,
            customerName: customer.customerName || prev.customerName,
            industry:     customer.industry     || prev.industry,
            region:       customer.region       || prev.region,
            owner:        customer.owner        || prev.owner,
          }));
          setCrmMeta(customer);
          setLookup('found');
        } else {
          setCrmMeta(null);
          setLookup('notfound');
        }
      } catch {
        setCrmMeta(null);
        setLookup('error');
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [form.crmAccountId]);

  const validateStep1 = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = 'Required';
    if (!form.industry)            e.industry     = 'Required';
    if (!form.region)              e.region       = 'Required';
    if (!form.sponsorName.trim())  e.sponsorName  = 'Required';
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.projectName.trim())      e.projectName      = 'Required';
    if (!form.problemStatement.trim()) e.problemStatement = 'Required';
    if (!form.lineOfBusiness)          e.lineOfBusiness   = 'Required';
    return e;
  };

  const handleNext = () => {
    const e = step === 1 ? validateStep1() : step === 2 ? validateStep2() : {};
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep(s => s - 1);
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const {
        crmAccountId, extLinkType, extLinkUrl, jouleCapabilities,
        owner, status, startDate, endDate,   // engagement-only fields, not in Proposals schema
        ...rest
      } = form;
      await onAdd({
        ...rest,
        jouleCapabilities: jouleCapabilities.length > 0 ? JSON.stringify(jouleCapabilities) : '',
        externalId:     crmAccountId || undefined,
        proposalStatus: 'Under Review',
        submittedBy:    currentUser?.name || '',
      });
      onClose();
    } catch (err) {
      setSubmitError('Failed to submit proposal. Please try again.');
      setSubmitting(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '';
    const dropped = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...dropped]);
  };

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selected]);
  };

  const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const locked = lookupState === 'found';

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.wizard} onClick={e => e.stopPropagation()}>

        {/* ── Top bar ── */}
        <div className={styles.wizTopbar}>
          <button className={styles.backLink} onClick={onClose}>
            <ChevronLeft size={14} /> Back to Dashboard
          </button>
          <div className={styles.wizSep} />

          <div className={styles.stepperWrap}>
            {STEPS.map((s, i) => (
              <div key={s.num} className={styles.stepItem}>
                <div className={`${styles.stepNum} ${step === s.num ? styles.stepActive : step > s.num ? styles.stepDone : ''}`}>
                  {step > s.num ? <Check size={11} /> : s.num}
                </div>
                <span className={`${styles.stepLabel} ${step === s.num ? styles.stepLabelActive : step > s.num ? styles.stepLabelDone : ''}`}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`${styles.stepConnector} ${step > s.num ? styles.stepConnectorDone : ''}`} />
                )}
              </div>
            ))}
          </div>

          <button className={styles.closeBtn} onClick={onClose}><X size={16} /></button>
        </div>

        {/* ── Wizard body ── */}
        <div className={styles.wizBody}>

          <div className={styles.formCol}>

            {/* ─── STEP 1: Customer Info + Contacts ─── */}
            {step === 1 && (
              <>
                {/* CRM Lookup Card */}
                <div className={styles.formCard}>
                  <div className={styles.formCardHd}>
                    <h3 className={styles.formCardTitle}>
                      <span className={styles.sectionIcon}><Search size={14} /></span>
                      CRM Lookup
                    </h3>
                  </div>
                  <div className={styles.formCardBody}>
                    <div className={styles.crmRow}>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label className={styles.formLabel}>CRM Account ID</label>
                        <div className={styles.crmInputWrap}>
                          <input
                            className={styles.formInput}
                            value={form.crmAccountId}
                            inputMode="numeric"
                            placeholder="e.g. 0001234567"
                            onChange={e => set('crmAccountId', e.target.value.replace(/\D/g, ''))}
                          />
                          <span className={styles.crmInputIcon}>
                            {lookupState === 'loading' && <Loader size={14} className={styles.spin} />}
                            {lookupState === 'found'   && <CheckCircle size={14} className={styles.iconFound} />}
                            {(lookupState === 'idle' || lookupState === 'notfound' || lookupState === 'error') && <Search size={14} className={styles.iconIdle} />}
                          </span>
                        </div>
                        {lookupState === 'found'    && <span className={`${styles.lookupHint} ${styles.hintFound}`}>Customer found — fields populated from MXP</span>}
                        {lookupState === 'notfound' && <span className={`${styles.lookupHint} ${styles.hintWarn}`}>No match — fill details manually</span>}
                        {lookupState === 'error'    && <span className={`${styles.lookupHint} ${styles.hintWarn}`}>Lookup failed — fill details manually</span>}
                      </div>
                      {lookupState === 'found' && (
                        <div className={styles.crmBadge}><CheckCircle size={13} /> MXP Verified</div>
                      )}
                    </div>
                    {crmMeta && (
                      <div className={styles.crmMetaBanner}>
                        {crmMeta.city          && <div className={styles.crmMetaItem}><span className={styles.crmMetaLbl}>City</span><span className={styles.crmMetaVal}>{crmMeta.city}</span></div>}
                        {crmMeta.planningEntity && <div className={styles.crmMetaItem}><span className={styles.crmMetaLbl}>Planning Entity</span><span className={styles.crmMetaVal}>{crmMeta.planningEntity}</span></div>}
                        {crmMeta.planningGroup  && <div className={styles.crmMetaItem}><span className={styles.crmMetaLbl}>Planning Group</span><span className={styles.crmMetaVal}>{crmMeta.planningGroup}</span></div>}
                        {crmMeta.erpAccount     && <div className={styles.crmMetaItem}><span className={styles.crmMetaLbl}>ERP Account</span><span className={styles.crmMetaVal}>{crmMeta.erpAccount}</span></div>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Information Card */}
                <div className={styles.formCard}>
                  <div className={styles.formCardHd}>
                    <h3 className={styles.formCardTitle}>
                      <span className={styles.sectionIcon}><Building2 size={14} /></span>
                      Customer Information
                    </h3>
                  </div>
                  <div className={styles.formCardBody}>
                    <div className={styles.formGrid}>
                      <div className={`${styles.formGroup} ${styles.span2}`}>
                        <label className={styles.formLabel}>Customer Name <span className={styles.req}>*</span></label>
                        <input
                          className={`${styles.formInput} ${locked ? styles.populated : ''} ${errors.customerName ? styles.inputError : ''}`}
                          value={form.customerName}
                          readOnly={locked}
                          placeholder="e.g. SAP SE"
                          onChange={e => set('customerName', e.target.value)}
                        />
                        {errors.customerName && <span className={styles.fieldError}>{errors.customerName}</span>}
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Industry <span className={styles.req}>*</span></label>
                        <select
                          className={`${styles.formSelect} ${locked && form.industry ? styles.populated : ''} ${errors.industry ? styles.inputError : ''}`}
                          value={form.industry}
                          disabled={locked && !!form.industry}
                          onChange={e => set('industry', e.target.value)}
                        >
                          <option value="">Select Industry</option>
                          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                        {errors.industry && <span className={styles.fieldError}>{errors.industry}</span>}
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Region <span className={styles.req}>*</span></label>
                        <select
                          className={`${styles.formSelect} ${locked && form.region ? styles.populated : ''} ${errors.region ? styles.inputError : ''}`}
                          value={form.region}
                          disabled={locked && !!form.region}
                          onChange={e => set('region', e.target.value)}
                        >
                          <option value="">Select Region</option>
                          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        {errors.region && <span className={styles.fieldError}>{errors.region}</span>}
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Country</label>
                        <select
                          className={`${styles.formSelect} ${locked && form.country ? styles.populated : ''}`}
                          value={form.country}
                          onChange={e => set('country', e.target.value)}
                        >
                          <option value="">Select Country</option>
                          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Account Team</label>
                        <input
                          className={`${styles.formInput} ${locked && form.accountTeam ? styles.populated : ''}`}
                          value={form.accountTeam}
                          readOnly={locked && !!form.accountTeam}
                          placeholder="Account team name"
                          onChange={e => set('accountTeam', e.target.value)}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Customer Segment</label>
                        <select className={styles.formSelect} value={form.customerSegment} onChange={e => set('customerSegment', e.target.value)}>
                          <option value="">Select Segment</option>
                          {SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Contacts Card */}
                <div className={styles.formCard}>
                  <div className={styles.formCardHd}>
                    <h3 className={styles.formCardTitle}>
                      <span className={styles.sectionIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 14, height: 14 }}>
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                          <line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/>
                        </svg>
                      </span>
                      Customer Contacts
                    </h3>
                  </div>

                  <div className={styles.contactSection}>
                    <div className={styles.contactSectionTitle}>Customer Sponsor <span className={styles.req}>*</span></div>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Full Name</label>
                        <input
                          className={`${styles.formInput} ${errors.sponsorName ? styles.inputError : ''}`}
                          value={form.sponsorName}
                          placeholder="Sponsor name"
                          onChange={e => set('sponsorName', e.target.value)}
                        />
                        {errors.sponsorName && <span className={styles.fieldError}>{errors.sponsorName}</span>}
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Title / Role</label>
                        <input className={styles.formInput} value={form.sponsorTitle} placeholder="Job title" onChange={e => set('sponsorTitle', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email</label>
                        <input type="email" className={styles.formInput} value={form.sponsorEmail} placeholder="email@company.com" onChange={e => set('sponsorEmail', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Phone</label>
                        <input type="tel" className={styles.formInput} value={form.sponsorPhone} placeholder="+XX XXX XXXXXXX" onChange={e => set('sponsorPhone', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className={styles.contactSection}>
                    <div className={styles.contactSectionTitle}>Customer Technical Contact</div>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Full Name</label>
                        <input className={styles.formInput} value={form.techContactName} placeholder="Technical contact name" onChange={e => set('techContactName', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Title / Role</label>
                        <input className={styles.formInput} value={form.techContactTitle} placeholder="Job title" onChange={e => set('techContactTitle', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email</label>
                        <input type="email" className={styles.formInput} value={form.techContactEmail} placeholder="email@company.com" onChange={e => set('techContactEmail', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Phone</label>
                        <input type="tel" className={styles.formInput} value={form.techContactPhone} placeholder="+XX XXX XXXXXXX" onChange={e => set('techContactPhone', e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ─── STEP 2: Business Opportunity ─── */}
            {step === 2 && (
              <div className={styles.formCard}>
                <div className={styles.formCardHd}>
                  <h3 className={styles.formCardTitle}>
                    <span className={styles.sectionIcon}><DollarSign size={14} /></span>
                    Business Opportunity
                  </h3>
                </div>
                <div className={styles.formCardBody}>
                  <div className={styles.formGrid}>
                    <div className={`${styles.formGroup} ${styles.span2}`}>
                      <label className={styles.formLabel}>Project Title <span className={styles.req}>*</span></label>
                      <input
                        className={`${styles.formInput} ${errors.projectName ? styles.inputError : ''}`}
                        value={form.projectName}
                        placeholder="Brief, descriptive project title"
                        onChange={e => set('projectName', e.target.value)}
                      />
                      {errors.projectName && <span className={styles.fieldError}>{errors.projectName}</span>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.span2}`}>
                      <label className={styles.formLabel}>Problem Statement <span className={styles.req}>*</span></label>
                      <textarea
                        className={`${styles.formTextarea} ${errors.problemStatement ? styles.inputError : ''}`}
                        rows={4}
                        value={form.problemStatement}
                        placeholder="Describe the customer's core business problem or challenge…"
                        onChange={e => set('problemStatement', e.target.value)}
                      />
                      {errors.problemStatement && <span className={styles.fieldError}>{errors.problemStatement}</span>}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Line of Business <span className={styles.req}>*</span></label>
                      <select
                        className={`${styles.formSelect} ${errors.lineOfBusiness ? styles.inputError : ''}`}
                        value={form.lineOfBusiness}
                        onChange={e => set('lineOfBusiness', e.target.value)}
                      >
                        <option value="">Select Line of Business</option>
                        {LINE_OF_BUSINESS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                      {errors.lineOfBusiness && <span className={styles.fieldError}>{errors.lineOfBusiness}</span>}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Expected Timeline</label>
                      <select className={styles.formSelect} value={form.timeline} onChange={e => set('timeline', e.target.value)}>
                        {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div className={`${styles.formGroup} ${styles.span2}`}>
                      <label className={styles.formLabel}>Joule Studio Capabilities Involved</label>
                      <div className={styles.chipWrap}>
                        {JOULE_CAPABILITIES.map(cap => (
                          <button
                            key={cap}
                            type="button"
                            className={`${styles.capChip} ${form.jouleCapabilities.includes(cap) ? styles.capChipSelected : ''}`}
                            onClick={() => toggleCapability(cap)}
                          >
                            {form.jouleCapabilities.includes(cap) && <Check size={11} />}
                            {cap}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={`${styles.formGroup} ${styles.span2}`}>
                      <label className={styles.formLabel}>Business Value (0–100)</label>
                      <div className={styles.sliderWrap}>
                        <input
                          type="range" min="0" max="100"
                          className={styles.slider}
                          value={form.businessValue}
                          onChange={e => set('businessValue', Number(e.target.value))}
                        />
                        <div className={styles.sliderLabels}>
                          <span>Low</span><span>Medium</span><span>High</span>
                          <span className={styles.sliderVal}>{form.businessValue}</span>
                          <span>Critical</span>
                        </div>
                      </div>
                    </div>

                    <div className={`${styles.formGroup} ${styles.span2}`}>
                      <label className={styles.formLabel}>Strategic Importance (0–100)</label>
                      <div className={styles.sliderWrap}>
                        <input
                          type="range" min="0" max="100"
                          className={styles.slider}
                          value={form.strategicImportance}
                          onChange={e => set('strategicImportance', Number(e.target.value))}
                        />
                        <div className={styles.sliderLabels}>
                          <span>Low</span><span>Medium</span><span>High</span>
                          <span className={styles.sliderVal}>{form.strategicImportance}</span>
                          <span>Critical</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Priority <span className={styles.req}>*</span></label>
                      <select className={styles.formSelect} value={form.priority} onChange={e => set('priority', e.target.value)}>
                        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>

                    <div className={`${styles.formGroup} ${styles.span2}`}>
                      <label className={styles.formLabel}>Potential Reference Customer</label>
                      <div className={styles.toggleWrap}>
                        <label className={styles.toggle}>
                          <input
                            type="checkbox"
                            checked={form.isReferenceCustomer}
                            onChange={e => set('isReferenceCustomer', e.target.checked)}
                          />
                          <span className={styles.toggleSlider} />
                        </label>
                        <span className={styles.toggleLabel}>
                          {form.isReferenceCustomer ? 'Yes — this customer may serve as a reference' : 'No — not a reference customer'}
                        </span>
                      </div>
                    </div>

                    <div className={`${styles.formGroup} ${styles.span2}`}>
                      <label className={styles.formLabel}>Notes / Additional Context</label>
                      <textarea
                        className={styles.formTextarea}
                        value={form.notes}
                        placeholder="Additional scope, requirements, or context…"
                        onChange={e => set('notes', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── STEP 3: Supporting Documents ─── */}
            {step === 3 && (
              <div className={styles.formCard}>
                <div className={styles.formCardHd}>
                  <h3 className={styles.formCardTitle}>
                    <span className={styles.sectionIcon}><FileText size={14} /></span>
                    Supporting Documents
                  </h3>
                </div>

                {/* Drop zone */}
                <div className={styles.dropZoneWrap}>
                  <div
                    className={styles.dropZone}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add(styles.dropZoneActive); }}
                    onDragLeave={e => e.currentTarget.classList.remove(styles.dropZoneActive)}
                    onDrop={e => { e.currentTarget.classList.remove(styles.dropZoneActive); handleFileDrop(e); }}
                  >
                    <input ref={fileInputRef} type="file" style={{ display: 'none' }} multiple onChange={handleFileSelect} />
                    <Upload size={24} className={styles.dropZoneIcon} />
                    <div className={styles.dropZoneText}>Drop files here or click to upload</div>
                    <div className={styles.dropZoneSub}>Supports: PDF, PPTX, DOCX, XLSX, EML, MSG, ZIP · Max 50MB per file</div>
                  </div>
                </div>

                {/* Quick label row */}
                <div className={styles.docTypeRow}>
                  <span className={styles.docTypeLabel}>Quick Label:</span>
                  {['Architecture', 'Presentation', 'Meeting Notes', 'Emails', 'Requirements', 'Other'].map(lbl => (
                    <button key={lbl} type="button" className={styles.docTypeBtn}>{lbl}</button>
                  ))}
                </div>

                {/* Uploaded files */}
                {files.length > 0 && (
                  <div className={styles.fileListWrap}>
                    <div className={styles.fileListTitle}>Uploaded Files ({files.length})</div>
                    <div className={styles.fileGrid}>
                      {files.map((f, i) => (
                        <div key={i} className={styles.fileCard}>
                          <div className={styles.fileIconWrap}>📄</div>
                          <div className={styles.fileInfo}>
                            <div className={styles.fileName}>{f.name}</div>
                            <div className={styles.fileMeta}>{(f.size / 1024 / 1024).toFixed(1)} MB</div>
                          </div>
                          <button className={styles.fileRemove} onClick={() => removeFile(i)}><X size={13} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* External reference link */}
                <div className={styles.extLinkWrap}>
                  <div className={styles.extLinkTitle}>External Reference Link</div>
                  <div className={styles.extLinkRow}>
                    <select className={styles.formSelect} style={{ width: 140, flexShrink: 0 }} value={form.extLinkType} onChange={e => set('extLinkType', e.target.value)}>
                      {EXT_LINK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input
                      type="url"
                      className={styles.formInput}
                      style={{ flex: 1 }}
                      placeholder="Paste URL here…"
                      value={form.extLinkUrl}
                      onChange={e => set('extLinkUrl', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── STEP 4: Review & Submit ─── */}
            {step === 4 && (
              <>
                {/* Customer Summary */}
                <div className={styles.summaryCard}>
                  <div className={styles.summaryCardHd}>
                    <Building2 size={14} color="var(--color-primary, #0070f2)" />
                    <span className={styles.summaryCardTitle}>Customer Information</span>
                    <button className={styles.summaryEditLink} onClick={() => setStep(1)}>Edit</button>
                  </div>
                  <div className={styles.summaryCardBody}>
                    <div className={styles.reviewGrid}>
                      <ReviewRow label="Customer Name"    value={form.customerName} />
                      <ReviewRow label="Customer ID"      value={form.crmAccountId || '—'} />
                      <ReviewRow label="Industry"         value={form.industry || '—'} />
                      <ReviewRow label="Region"           value={form.region || '—'} />
                      <ReviewRow label="Country"          value={form.country || '—'} />
                      <ReviewRow label="Segment"          value={form.customerSegment || '—'} />
                      {form.accountTeam && <ReviewRow label="Account Team" value={form.accountTeam} className={styles.span2} />}
                    </div>
                  </div>
                </div>

                {/* Opportunity Summary */}
                <div className={styles.summaryCard}>
                  <div className={styles.summaryCardHd}>
                    <DollarSign size={14} color="var(--color-primary, #0070f2)" />
                    <span className={styles.summaryCardTitle}>Business Opportunity</span>
                    <button className={styles.summaryEditLink} onClick={() => setStep(2)}>Edit</button>
                  </div>
                  <div className={styles.summaryCardBody}>
                    <div className={styles.reviewGrid}>
                      <div className={`${styles.reviewRow} ${styles.span2}`}>
                        <span className={styles.reviewLabel}>Project Title</span>
                        <span className={styles.reviewValue}>{form.projectName}</span>
                      </div>
                      <ReviewRow label="Line of Business" value={form.lineOfBusiness || '—'} />
                      <ReviewRow label="Timeline"         value={form.timeline} />
                      <ReviewRow label="Priority"         value={form.priority} />
                      <ReviewRow label="Business Value"   value={`${form.businessValue}/100`} />
                      <ReviewRow label="Strategic Importance" value={`${form.strategicImportance}/100`} />
                      <ReviewRow label="Reference Customer"   value={form.isReferenceCustomer ? 'Yes' : 'No'} />
                    </div>
                    {form.jouleCapabilities.length > 0 && (
                      <div className={styles.reviewChips}>
                        <div className={styles.reviewLabel} style={{ marginBottom: 6 }}>Joule Capabilities</div>
                        <div className={styles.chipWrap}>
                          {form.jouleCapabilities.map(c => (
                            <span key={c} className={styles.reviewChipItem}>{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {form.problemStatement && (
                      <div className={styles.reviewProblem}>
                        <div className={styles.reviewLabel} style={{ marginBottom: 4 }}>Problem Statement</div>
                        <div className={styles.reviewValue} style={{ whiteSpace: 'pre-wrap', fontWeight: 400, fontSize: 12.5, lineHeight: 1.5 }}>
                          {form.problemStatement}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contacts Summary */}
                <div className={styles.summaryCard}>
                  <div className={styles.summaryCardHd}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-primary, #0070f2)" strokeWidth="2" strokeLinecap="round" style={{ width: 14, height: 14 }}>
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    </svg>
                    <span className={styles.summaryCardTitle}>Contacts</span>
                    <button className={styles.summaryEditLink} onClick={() => setStep(1)}>Edit</button>
                  </div>
                  <div className={styles.summaryCardBody}>
                    <div className={styles.contactGrid}>
                      {form.sponsorName && (
                        <div className={styles.contactMini}>
                          <div className={styles.contactAvatar}>{form.sponsorName.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
                          <div>
                            <div className={styles.contactName}>{form.sponsorName}</div>
                            <div className={styles.contactRole}>Customer Sponsor{form.sponsorTitle ? ` · ${form.sponsorTitle}` : ''}</div>
                            {form.sponsorEmail && <div className={styles.contactEmail}>{form.sponsorEmail}{form.sponsorPhone ? ` · ${form.sponsorPhone}` : ''}</div>}
                          </div>
                        </div>
                      )}
                      {form.techContactName && (
                        <div className={styles.contactMini}>
                          <div className={styles.contactAvatar} style={{ background: 'linear-gradient(135deg,#1a8a4a,#4db8ff)' }}>{form.techContactName.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
                          <div>
                            <div className={styles.contactName}>{form.techContactName}</div>
                            <div className={styles.contactRole}>Technical Contact{form.techContactTitle ? ` · ${form.techContactTitle}` : ''}</div>
                            {form.techContactEmail && <div className={styles.contactEmail}>{form.techContactEmail}</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Documents Summary */}
                {(files.length > 0 || form.extLinkUrl) && (
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryCardHd}>
                      <FileText size={14} color="var(--color-primary, #0070f2)" />
                      <span className={styles.summaryCardTitle}>Attachments{files.length > 0 ? ` (${files.length})` : ''}</span>
                      <button className={styles.summaryEditLink} onClick={() => setStep(3)}>Edit</button>
                    </div>
                    <div className={styles.summaryCardBody}>
                      {files.map((f, i) => (
                        <div key={i} className={styles.fileMini}>
                          <span style={{ fontSize: 16 }}>📄</span>
                          <div>
                            <div className={styles.fileMiniName}>{f.name}</div>
                            <div className={styles.fileMiniMeta}>{(f.size / 1024 / 1024).toFixed(1)} MB</div>
                          </div>
                        </div>
                      ))}
                      {form.extLinkUrl && (
                        <div className={styles.fileMini} style={{ marginTop: 6 }}>
                          <Link size={14} color="#0070f2" />
                          <div>
                            <div className={styles.fileMiniName}>{form.extLinkType}</div>
                            <div className={styles.fileMiniMeta}>{form.extLinkUrl}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

        </div>

        {/* ── Footer ── */}
        <div className={styles.wizFooter}>
          {submitError && <span className={styles.submitError}>{submitError}</span>}
          <div className={styles.wizNav}>
            {step > 1 ? (
              <button className={styles.btnSecondary} onClick={handleBack} disabled={submitting}>
                <ChevronLeft size={14} /> Back
              </button>
            ) : (
              <button className={styles.btnSecondary} onClick={onClose} disabled={submitting}>Cancel</button>
            )}
            {step < STEPS.length ? (
              <button className={styles.btnPrimary} onClick={handleNext}>
                {step === 1 ? 'Next: Business Opportunity' : step === 2 ? 'Next: Documents' : 'Next: Review'}
                <ChevronRight size={14} />
              </button>
            ) : (
              <button className={styles.btnPrimary} onClick={handleSubmit} disabled={submitting}>
                {submitting ? <><Loader size={14} className={styles.spin} /> Submitting…</> : <><Sparkles size={14} /> Submit for Review</>}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function ReviewRow({ label, value, className }) {
  return (
    <div className={`${styles.reviewRow}${className ? ` ${className}` : ''}`}>
      <span className={styles.reviewLabel}>{label}</span>
      <span className={styles.reviewValue}>{value}</span>
    </div>
  );
}
