import { useState, useEffect } from 'react';
import { 
  FileText, Download, Plus, Trash2, Moon, Sun, Globe, 
  Camera, Upload, Save, UploadCloud, HelpCircle, X, AlertTriangle, 
  User, Briefcase, GraduationCap, Award, Wrench, ChevronRight 
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CvPdfDocument } from './CvPdfDocument';
import { translations, emptyData } from './translations';

const generateId = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9);

const clsInput = "w-full bg-slate-50 dark:bg-[#0a0a0a] border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400/70 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all shadow-sm";
const clsBtnSecondary = "flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-[#111111] hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium px-3 md:px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer";
const clsSectionTitle = "flex flex-row items-center gap-2.5 text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6";
const clsItemCard = "bg-slate-50/50 dark:bg-[#111111]/50 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm relative group";
const clsBtnAddDashed = "w-full mt-4 flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold rounded-xl hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-all cursor-pointer";

const FormField = ({ label, error, children, className = "" }) => (
  <div className={`flex flex-col gap-1.5 w-full ${className}`}>
    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">
      {label}
    </label>
    {children}
    {error && <span className="text-[10px] text-rose-500 font-medium px-1 mt-0.5">{error}</span>}
  </div>
);

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('appLang') || 'es');
  const t = translations[lang];
  const [theme, setTheme] = useState(() => localStorage.getItem('appTheme') || 'dark');
  const [template, setTemplate] = useState('standard');
  
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  
  const [showMobileWarning, setShowMobileWarning] = useState(() => {
    const isMobile = window.innerWidth < 768;
    const warningSeen = sessionStorage.getItem('mobileWarningSeen');
    return isMobile && !warningSeen;
  });

  const [cv, setCv] = useState(emptyData);

  useEffect(() => { localStorage.setItem('appLang', lang); }, [lang]);

  useEffect(() => {
    localStorage.setItem('appTheme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang(prev => prev === 'es' ? 'en' : 'es');
  const dismissMobileWarning = () => {
    sessionStorage.setItem('mobileWarningSeen', 'true');
    setShowMobileWarning(false);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(cv, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CV_Data_${(cv.fullName || 'MyFreeCV').replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) {
      alert(t.importSizeErr);
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const safeExperiences = (Array.isArray(parsed.experiences) ? parsed.experiences : []).map(exp => ({
          id: exp.id ? String(exp.id) : generateId(),
          company: exp.company ? String(exp.company) : '',
          position: exp.position ? String(exp.position) : '',
          startYear: exp.startYear ? String(exp.startYear) : '',
          endYear: exp.endYear ? String(exp.endYear) : '',
          current: Boolean(exp.current),
          description: exp.description ? String(exp.description) : ''
        }));
        
        setCv({
          photo: parsed.photo ? String(parsed.photo) : '',
          fullName: parsed.fullName ? String(parsed.fullName) : '',
          title: parsed.title ? String(parsed.title) : '',
          email: parsed.email ? String(parsed.email) : '',
          phone: parsed.phone ? String(parsed.phone) : '',
          location: parsed.location ? String(parsed.location) : '',
          summary: parsed.summary ? String(parsed.summary) : '',
          experiences: safeExperiences.length ? safeExperiences : emptyData.experiences,
          education: Array.isArray(parsed.education) ? parsed.education : emptyData.education,
          certifications: Array.isArray(parsed.certifications) ? parsed.certifications : emptyData.certifications,
          skills: Array.isArray(parsed.skills) ? parsed.skills : emptyData.skills
        });
      } catch (error) {
        console.error("JSON parse error:", error);
        alert(t.importErr);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; 
  };

  const isEmailValid = (email) => email === '' || /^\S+@\S+\.\S+$/.test(email);
  
  const handleTextChange = (field, val) => {
    if (field === 'phone') val = val.replace(/[^+\d\s-()]/g, '');
    setCv(prev => ({ ...prev, [field]: val }));
  };
  
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert(t.photoSizeErr); e.target.value = ''; return; }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { alert(t.photoFormatErr); e.target.value = ''; return; }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400; 
        let width = img.width; let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
        } else {
          if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
        }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        setCv(prev => ({ ...prev, photo: canvas.toDataURL('image/jpeg', 0.8) }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = ''; 
  };

  const handleExpChange = (idx, field, val) => {
    const updated = [...cv.experiences];
    if (field === 'startYear' || field === 'endYear') val = val.slice(0, 4);
    updated[idx][field] = val;
    if (field === 'current' && val === true) updated[idx].endYear = '';
    setCv(prev => ({ ...prev, experiences: updated }));
  };
  const handleEduChange = (idx, field, val) => {
    const updated = [...cv.education];
    if (field === 'year') val = val.slice(0, 4);
    updated[idx][field] = val;
    setCv(prev => ({ ...prev, education: updated }));
  };
  const handleSkillChange = (idx, val) => {
    const updated = [...cv.skills];
    updated[idx].name = val;
    setCv(prev => ({ ...prev, skills: updated }));
  };
  const handleCertChange = (idx, field, val) => {
    const updated = [...cv.certifications];
    if (field === 'year') val = val.slice(0, 4);
    updated[idx][field] = val;
    setCv(prev => ({ ...prev, certifications: updated }));
  };

  const addExperience = () => setCv(prev => ({ ...prev, experiences: [...prev.experiences, { id: generateId(), company: '', position: '', startYear: '', endYear: '', current: false, description: '' }] }));
  const removeExperience = (idx) => setCv(prev => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== idx) }));
  
  const addEducation = () => setCv(prev => ({ ...prev, education: [...prev.education, { id: generateId(), institution: '', degree: '', year: '' }] }));
  const removeEducation = (idx) => setCv(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }));
  
  const addSkill = () => setCv(prev => ({ ...prev, skills: [...prev.skills, { id: generateId(), name: '' }] }));
  const removeSkill = (idx) => setCv(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }));
  
  const addCertification = () => setCv(prev => ({ ...prev, certifications: [...prev.certifications, { id: generateId(), name: '', year: '', issuer: '' }] }));
  const removeCertification = (idx) => setCv(prev => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== idx) }));

  const confirmResetForm = () => {
    setCv({
      ...emptyData,
      experiences: [{ id: generateId(), company: '', position: '', startYear: '', endYear: '', current: false, description: '' }],
      education: [{ id: generateId(), institution: '', degree: '', year: '' }],
      skills: [{ id: generateId(), name: '' }],
      certifications: [{ id: generateId(), name: '', year: '', issuer: '' }]
    });
    setShowClearModal(false);
  };

  const formatPeriod = (start, end, isCurrent) => {
    const endDate = isCurrent ? t.present : end;
    return [start, endDate].filter(Boolean).join(' - ');
  };

  // Función interna para renderizar la vista previa según la plantilla
  const renderPreviewContent = () => {
    if (template === 'creative') {
      return (
        <div className="flex flex-col sm:flex-row min-h-[600px] w-full rounded-xl overflow-hidden shadow-2xl border border-slate-200">
          {/* BARRA LATERAL (Sidebar) */}
          <div className="w-full sm:w-1/3 bg-slate-800 text-slate-100 p-6 flex flex-col items-center text-center sm:text-left sm:items-start">
            {cv.photo && (
              <img src={cv.photo} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-slate-600 shadow-md mb-4 mx-auto sm:mx-0" />
            )}
            <h2 className="text-xl font-bold leading-tight break-words text-white mb-1">{cv.fullName || t.name}</h2>
            <p className="text-indigo-400 font-medium text-xs mb-6 uppercase tracking-wider">{cv.title || t.role}</p>
            
            <div className="w-full space-y-3 mb-8 text-[11px] text-slate-300">
              {cv.email && <div><strong className="block text-white mb-0.5">Email</strong> {cv.email}</div>}
              {cv.phone && <div><strong className="block text-white mb-0.5">Phone</strong> {cv.phone}</div>}
              {cv.location && <div><strong className="block text-white mb-0.5">Location</strong> {cv.location}</div>}
            </div>

            {cv.skills.length > 0 && cv.skills.some(s => s.name) && (
              <div className="w-full">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-600 pb-1 mb-3">{t.pdfTitleSkills}</h3>
                <ul className="space-y-1.5 text-[11px] text-slate-200">
                  {cv.skills.filter(s => s.name).map((skill, i) => (
                    <li key={skill.id || i}>• {skill.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* CONTENIDO PRINCIPAL */}
          <div className="w-full sm:w-2/3 bg-white p-8">
            {cv.summary && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-slate-100 pb-1.5 mb-3">{t.pdfTitleSummary}</h3>
                <p className="text-[11px] text-slate-700 leading-relaxed text-justify whitespace-pre-wrap break-words">{cv.summary}</p>
              </div>
            )}

            {cv.experiences.length > 0 && cv.experiences.some(e => e.position || e.company) && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-slate-100 pb-1.5 mb-3">{t.pdfTitleExp}</h3>
                {cv.experiences.map((exp, i) => (
                  <div key={exp.id || i} className="mb-4">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>{exp.position}</span>
                      <span className="text-slate-500 font-normal text-[10px]">{formatPeriod(exp.startYear, exp.endYear, exp.current)}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mb-1.5">{exp.company}</div>
                    <p className="text-[11px] text-slate-700 leading-relaxed text-justify whitespace-pre-wrap break-words">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {cv.education.length > 0 && cv.education.some(e => e.degree || e.institution) && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-slate-100 pb-1.5 mb-3">{t.pdfTitleEdu}</h3>
                {cv.education.map((edu, i) => (
                  <div key={edu.id || i} className="mb-3">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>{edu.degree}</span>
                      <span className="text-slate-500 font-normal text-[10px]">{edu.year}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">{edu.institution}</div>
                  </div>
                ))}
              </div>
            )}

            {cv.certifications.length > 0 && cv.certifications.some(c => c.name) && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-slate-100 pb-1.5 mb-3">{t.pdfTitleCerts}</h3>
                {cv.certifications.map((cert, i) => (
                  <div key={cert.id || i} className="mb-3">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>{cert.name}</span>
                      <span className="text-slate-500 font-normal text-[10px]">{cert.year}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">{cert.issuer}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Renderizado para Standard, Harvard, Awesome, Minimalist
    return (
      <div className={`bg-white text-slate-900 p-8 rounded-xl shadow-2xl min-h-[600px] border border-slate-200 overflow-hidden ${template === 'harvard' ? 'font-serif' : ''}`}>
        
        {template === 'harvard' ? (
          <div className="text-center border-b-2 border-black pb-4 mb-5">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-black">{cv.fullName || t.name}</h2>
            <p className="text-black font-semibold text-sm mt-1">{cv.title || t.role}</p>
            <p className="text-slate-600 text-[11px] mt-1.5">
              {[cv.email, cv.phone, cv.location].filter(Boolean).join(' • ')}
            </p>
          </div>
        ) : (
          <div className={`flex items-center gap-5 border-b-2 pb-4 mb-5 ${template === 'awesome' ? 'border-rose-600' : 'border-indigo-600'}`}>
            {cv.photo && (
              <img src={cv.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover shadow-sm border border-slate-200 flex-shrink-0" />
            )}
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold leading-tight break-words text-slate-900">{cv.fullName || t.name}</h2>
              <p className={`font-medium text-sm mt-0.5 ${template === 'awesome' ? 'text-rose-600' : 'text-indigo-600'}`}>{cv.title || t.role}</p>
              <p className="text-slate-500 text-[11px] mt-1.5 break-words">
                {[cv.email, cv.phone, cv.location].filter(Boolean).join(' • ')}
              </p>
            </div>
          </div>
        )}

        {cv.summary && (
          <div className="mb-5">
            <h3 className={`text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1.5 mb-2.5 ${template === 'awesome' ? 'text-rose-700' : ''}`}>{t.pdfTitleSummary}</h3>
            <p className="text-[11px] text-slate-700 leading-relaxed text-justify whitespace-pre-wrap break-words">{cv.summary}</p>
          </div>
        )}

        {cv.experiences.length > 0 && cv.experiences.some(e => e.position || e.company) && (
          <div className="mb-5">
            <h3 className={`text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1.5 mb-2.5 ${template === 'awesome' ? 'text-rose-700' : ''}`}>{t.pdfTitleExp}</h3>
            {cv.experiences.map((exp, i) => (
              <div key={exp.id || i} className={`mb-3.5 ${template === 'minimalist' ? 'flex flex-row gap-4' : ''}`}>
                {template === 'minimalist' && (
                  <div className="w-1/4 pt-0.5 text-right text-[10px] text-slate-500 font-medium">
                    {formatPeriod(exp.startYear, exp.endYear, exp.current)}
                  </div>
                )}
                <div className={template === 'minimalist' ? 'w-3/4' : 'w-full'}>
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{exp.position}</span>
                    {template !== 'minimalist' && (
                      <span className="text-slate-500 font-normal text-[10px]">
                        {formatPeriod(exp.startYear, exp.endYear, exp.current)}
                      </span>
                    )}
                  </div>
                  <div className={`text-[11px] font-medium mb-1 ${template === 'harvard' ? 'text-slate-800 italic' : (template === 'awesome' ? 'text-rose-600' : 'text-indigo-600')}`}>{exp.company}</div>
                  <p className="text-[11px] text-slate-700 mt-1 leading-relaxed text-justify whitespace-pre-wrap break-words">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {cv.education.length > 0 && cv.education.some(e => e.degree || e.institution) && (
          <div className="mb-5">
            <h3 className={`text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1.5 mb-2.5 ${template === 'awesome' ? 'text-rose-700' : ''}`}>{t.pdfTitleEdu}</h3>
            {cv.education.map((edu, i) => (
              <div key={edu.id || i} className={`mb-2.5 ${template === 'minimalist' ? 'flex flex-row gap-4' : ''}`}>
                {template === 'minimalist' && (
                  <div className="w-1/4 pt-0.5 text-right text-[10px] text-slate-500 font-medium">{edu.year}</div>
                )}
                <div className={template === 'minimalist' ? 'w-3/4' : 'w-full'}>
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{edu.degree}</span>
                    {template !== 'minimalist' && <span className="text-slate-500 font-normal text-[10px]">{edu.year}</span>}
                  </div>
                  <div className={`text-[11px] font-medium ${template === 'harvard' ? 'text-slate-800' : (template === 'awesome' ? 'text-rose-600' : 'text-indigo-600')}`}>{edu.institution}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {cv.certifications.length > 0 && cv.certifications.some(c => c.name) && (
          <div className="mb-5">
            <h3 className={`text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1.5 mb-2.5 ${template === 'awesome' ? 'text-rose-700' : ''}`}>{t.pdfTitleCerts}</h3>
            {cv.certifications.map((cert, i) => (
              <div key={cert.id || i} className={`mb-2.5 ${template === 'minimalist' ? 'flex flex-row gap-4' : ''}`}>
                {template === 'minimalist' && (
                  <div className="w-1/4 pt-0.5 text-right text-[10px] text-slate-500 font-medium">{cert.year}</div>
                )}
                <div className={template === 'minimalist' ? 'w-3/4' : 'w-full'}>
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{cert.name}</span>
                    {template !== 'minimalist' && <span className="text-slate-500 font-normal text-[10px]">{cert.year}</span>}
                  </div>
                  <div className={`text-[11px] font-medium ${template === 'harvard' ? 'text-slate-800' : (template === 'awesome' ? 'text-rose-600' : 'text-indigo-600')}`}>{cert.issuer}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {cv.skills.length > 0 && cv.skills.some(s => s.name) && (
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1.5 mb-2.5 ${template === 'awesome' ? 'text-rose-700' : ''}`}>{t.pdfTitleSkills}</h3>
            <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-1 mt-1">
              {cv.skills.filter(s => s.name).map((skill, i) => (
                <li key={skill.id || i} className="leading-relaxed">{skill.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-20">
      
      {showMobileWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-2xl max-w-sm text-center border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.mobileTitle}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{t.mobileDesc}</p>
            <button onClick={dismissMobileWarning} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer">
              {t.mobileBtn}
            </button>
          </div>
        </div>
      )}

      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={() => setShowClearModal(false)}>
          <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
            <div className="mx-auto w-12 h-12 bg-rose-100 dark:bg-rose-500/20 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.confirmClearTitle}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{t.confirmClear}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowClearModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2.5 rounded-lg transition-colors cursor-pointer">
                {t.btnCancel}
              </button>
              <button onClick={confirmResetForm} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer">
                {t.btnConfirmClear}
              </button>
            </div>
          </div>
        </div>
      )}

      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={() => setShowHelpModal(false)}>
          <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-indigo-500" /> {t.helpTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.helpSubtitle}</p>
              </div>
              <button onClick={() => setShowHelpModal(false)} aria-label="Cerrar ayuda" className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <div><h4 className="font-semibold text-slate-900 dark:text-white mb-1">{t.helpStep1Title}</h4><p>{t.helpStep1Desc}</p></div>
              <div><h4 className="font-semibold text-slate-900 dark:text-white mb-1">{t.helpStep2Title}</h4><p>{t.helpStep2Desc}</p></div>
              <div><h4 className="font-semibold text-slate-900 dark:text-white mb-1">{t.helpStep3Title}</h4><p>{t.helpStep3Desc}</p></div>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-[#0a0a0a]">
              <button onClick={() => setShowHelpModal(false)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2 rounded-lg transition-colors cursor-pointer">{t.helpCloseBtn}</button>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-slate-50/90 dark:bg-black/90 backdrop-blur-md py-4 px-6 md:px-10 border-b border-slate-300 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-indigo-300">{t.appTitle}</h1>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-3">
            <div className="flex bg-white dark:bg-[#111111] border border-slate-300 dark:border-slate-800 rounded-lg p-1 shadow-sm">
              <button onClick={() => setShowHelpModal(true)} title={t.help} className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"><HelpCircle className="w-4 h-4" /></button>
              <div className="w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
              <button onClick={toggleLang} title="Language" className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"><Globe className="w-4 h-4" /></button>
              <div className="w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
              <button onClick={toggleTheme} title="Theme" className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex gap-2">
              <label className={clsBtnSecondary} title={t.import}>
                <UploadCloud className="w-4 h-4" /> <span className="hidden sm:inline">{t.import}</span>
                <input type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
              </label>
              <button onClick={handleExportJSON} className={clsBtnSecondary} title={t.save}>
                <Save className="w-4 h-4" /> <span className="hidden sm:inline">{t.save}</span>
              </button>
              <button onClick={() => setShowClearModal(true)} className={`${clsBtnSecondary} text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10`} title={t.clear}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <PDFDownloadLink document={<CvPdfDocument data={cv} dict={t} template={template} />} fileName={`CV_${(cv.fullName || 'Curriculum').replace(/\s+/g, '_')}.pdf`} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer ml-1">
              {({ loading }) => (
                <>
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">{loading ? t.preparing : t.export}</span>
                </>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        <section className="space-y-8 lg:col-span-7">
          
          <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h2 className={clsSectionTitle}><User className="w-5 h-5 shrink-0" /> {t.personalInfo}</h2>
            
            <div className="flex items-center gap-5 mb-6 bg-slate-50 dark:bg-[#111111] p-4 rounded-xl border border-slate-100 dark:border-slate-800/50">
              <div className="relative w-20 h-20 rounded-full bg-white dark:bg-black border-2 border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-inner">
                {cv.photo ? <img src={cv.photo} alt="Avatar" className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 text-slate-300 dark:text-slate-600" />}
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer w-fit text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-white dark:bg-black border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow">
                  <Upload className="w-4 h-4" /> {t.uploadPhoto}
                  <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handlePhotoUpload} />
                </label>
                {cv.photo && (
                  <button type="button" onClick={() => setCv(prev => ({...prev, photo: ''}))} className="text-xs text-rose-500 hover:text-rose-600 font-medium text-left px-1 w-fit cursor-pointer">
                    {t.removePhoto}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
              <FormField label={t.name}>
                <input className={clsInput} placeholder={t.phName} value={cv.fullName} onChange={e => handleTextChange('fullName', e.target.value)} />
              </FormField>
              <FormField label={t.role}>
                <input className={clsInput} placeholder={t.phRole} value={cv.title} onChange={e => handleTextChange('title', e.target.value)} />
              </FormField>
              <FormField label={t.email} error={!isEmailValid(cv.email) ? t.emailErr : null}>
                <input type="email" className={`${clsInput} ${!isEmailValid(cv.email) ? 'border-rose-500 focus:border-rose-500' : ''}`} placeholder={t.phEmail} value={cv.email} onChange={e => handleTextChange('email', e.target.value)} />
              </FormField>
              <FormField label={t.phone}>
                <input type="tel" maxLength="15" className={clsInput} placeholder={t.phPhone} value={cv.phone} onChange={e => handleTextChange('phone', e.target.value)} />
              </FormField>
              <FormField label={t.location} className="md:col-span-2">
                <input className={clsInput} placeholder={t.phLocation} value={cv.location} onChange={e => handleTextChange('location', e.target.value)} />
              </FormField>
              <FormField label={t.summary} className="md:col-span-2">
                <textarea rows={4} className={`${clsInput} resize-none`} placeholder={t.phSummary} value={cv.summary} onChange={e => handleTextChange('summary', e.target.value)} />
              </FormField>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h2 className={clsSectionTitle}><Briefcase className="w-5 h-5 shrink-0" /> {t.experience}</h2>
            
            <div className="space-y-6">
              {cv.experiences.map((exp, i) => {
                const isYearError = !exp.current && exp.startYear && exp.endYear && parseInt(exp.endYear) < parseInt(exp.startYear);
                return (
                  <div key={exp.id} className={clsItemCard}>
                    <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-800/60 pb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.expNum}{i + 1}</span>
                      <button type="button" onClick={() => removeExperience(i)} className="text-rose-400 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 p-1.5 rounded-md transition-colors cursor-pointer" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                      <FormField label={t.position}>
                        <input className={clsInput} placeholder={t.phPosition} value={exp.position} onChange={e => handleExpChange(i, 'position', e.target.value)} />
                      </FormField>
                      <FormField label={t.company}>
                        <input className={clsInput} placeholder={t.phCompany} value={exp.company} onChange={e => handleExpChange(i, 'company', e.target.value)} />
                      </FormField>
                      <FormField label={t.startYear}>
                        <input type="number" className={clsInput} placeholder={t.phStartYear} value={exp.startYear} onChange={e => handleExpChange(i, 'startYear', e.target.value)} />
                      </FormField>
                      <FormField label={t.endYear} error={isYearError ? t.yearErr : null}>
                        <div className="flex flex-col gap-2">
                          <input type="number" className={`${clsInput} disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-900 ${isYearError ? 'border-rose-500' : ''}`} placeholder={t.phEndYear} value={exp.endYear} onChange={e => handleExpChange(i, 'endYear', e.target.value)} disabled={exp.current} />
                          <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer w-fit">
                            <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={exp.current} onChange={e => handleExpChange(i, 'current', e.target.checked)} />
                            {t.current}
                          </label>
                        </div>
                      </FormField>
                      <FormField label={t.achievements} className="md:col-span-2">
                        <textarea rows={3} className={`${clsInput} resize-none`} placeholder={t.phAchievements} value={exp.description} onChange={e => handleExpChange(i, 'description', e.target.value)} />
                      </FormField>
                    </div>
                  </div>
                );
              })}
              
              <button type="button" onClick={addExperience} className={clsBtnAddDashed}>
                <Plus className="w-5 h-5" /> {t.addExp}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h2 className={clsSectionTitle}><GraduationCap className="w-5 h-5 shrink-0" /> {t.education}</h2>
            
            <div className="space-y-6">
              {cv.education.map((edu, i) => (
                <div key={edu.id} className={clsItemCard}>
                  <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-800/60 pb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.eduNum}{i + 1}</span>
                    <button type="button" onClick={() => removeEducation(i)} className="text-rose-400 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 p-1.5 rounded-md transition-colors cursor-pointer" title="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-4">
                    <FormField label={t.degree} className="md:col-span-4">
                      <input className={clsInput} placeholder={t.phDegree} value={edu.degree} onChange={e => handleEduChange(i, 'degree', e.target.value)} />
                    </FormField>
                    <FormField label={t.institution} className="md:col-span-3">
                      <input className={clsInput} placeholder={t.phInstitution} value={edu.institution} onChange={e => handleEduChange(i, 'institution', e.target.value)} />
                    </FormField>
                    <FormField label={t.year} className="md:col-span-1">
                      <input type="number" className={clsInput} placeholder={t.phYear} value={edu.year} onChange={e => handleEduChange(i, 'year', e.target.value)} />
                    </FormField>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addEducation} className={clsBtnAddDashed}>
                <Plus className="w-5 h-5" /> {t.addEdu}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h2 className={clsSectionTitle}><Award className="w-5 h-5 shrink-0" /> {t.certs}</h2>
            
            <div className="space-y-6">
              {cv.certifications.map((cert, i) => (
                <div key={cert.id} className={clsItemCard}>
                  <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-800/60 pb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.certNum}{i + 1}</span>
                    <button type="button" onClick={() => removeCertification(i)} className="text-rose-400 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 p-1.5 rounded-md transition-colors cursor-pointer" title="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-4">
                    <FormField label={t.certName} className="md:col-span-4">
                      <input className={clsInput} placeholder={t.phCertName} value={cert.name} onChange={e => handleCertChange(i, 'name', e.target.value)} />
                    </FormField>
                    <FormField label={t.issuer} className="md:col-span-3">
                      <input className={clsInput} placeholder={t.phIssuer} value={cert.issuer} onChange={e => handleCertChange(i, 'issuer', e.target.value)} />
                    </FormField>
                    <FormField label={t.year} className="md:col-span-1">
                      <input type="number" className={clsInput} placeholder={t.phYear} value={cert.year} onChange={e => handleCertChange(i, 'year', e.target.value)} />
                    </FormField>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addCertification} className={clsBtnAddDashed}>
                <Plus className="w-5 h-5" /> {t.addCert}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h2 className={clsSectionTitle}><Wrench className="w-5 h-5 shrink-0" /> {t.skills}</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cv.skills.map((skill, i) => (
                  <div key={skill.id} className="flex items-start gap-2">
                    <FormField label={`${t.skillNum}${i + 1}`}>
                      <input className={clsInput} placeholder={t.phSkill} value={skill.name} onChange={e => handleSkillChange(i, e.target.value)} />
                    </FormField>
                    <button type="button" onClick={() => removeSkill(i)} className="mt-[22px] text-rose-400 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 p-2.5 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-500/30" title="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addSkill} className={clsBtnAddDashed}>
                <Plus className="w-5 h-5" /> {t.addSkill}
              </button>
            </div>
          </div>

        </section>

        <section className="lg:col-span-5 relative">
          <div className="sticky top-24 space-y-5">
            
            {/* UX FIX: SELECTOR DE PLANTILLAS PROMINENTE CON AFFORDANCE DE SCROLL */}
            <div className="relative w-full rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden">
              <div className="bg-slate-200/50 dark:bg-[#0a0a0a] p-1.5 flex items-center gap-1 overflow-x-auto hide-scrollbar relative z-10">
                {[
                  { id: 'standard', name: t.tplStandard },
                  { id: 'harvard', name: t.tplHarvard },
                  { id: 'awesome', name: t.tplAwesome },
                  { id: 'minimalist', name: t.tplMinimalist },
                  { id: 'creative', name: t.tplCreative }
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setTemplate(tpl.id)}
                    className={`flex-1 min-w-max text-[11px] font-bold uppercase tracking-wider py-2.5 px-4 rounded-lg transition-all duration-300 cursor-pointer ${
                      template === tpl.id 
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-600' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>
              {/* Degradado y Flecha que indican que se puede hacer scroll hacia la derecha */}
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-200 dark:from-black to-transparent pointer-events-none flex items-center justify-end pr-2 z-20">
                <ChevronRight className="w-5 h-5 text-slate-500 dark:text-slate-400 animate-pulse drop-shadow-md" />
              </div>
            </div>

            {/* RENDERIZADOR DE LA VISTA PREVIA */}
            {renderPreviewContent()}

          </div>
        </section>
      </main>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default App;