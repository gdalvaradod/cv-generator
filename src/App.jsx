import { useState, useEffect } from 'react';
import { FileText, Download, Plus, Trash2, RotateCcw, Moon, Sun, Globe } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CvPdfDocument } from './CvPdfDocument';

// --- SISTEMA DE DICCIONARIOS (i18n) ---
const translations = {
  es: {
    appTitle: "My Free CV",
    clear: "Limpiar",
    export: "Exportar PDF",
    preparing: "Preparando...",
    personalInfo: "Datos Personales",
    name: "Nombre completo",
    role: "Rol o título profesional",
    email: "Correo electrónico",
    phone: "Número telefónico",
    location: "Ubicación (Ej. Ciudad, País)",
    summary: "Resumen o perfil profesional",
    experience: "Experiencia Laboral",
    add: "Agregar",
    expNum: "Experiencia #",
    position: "Puesto",
    company: "Empresa",
    startYear: "Desde (Año)",
    endYear: "Hasta (Año)",
    current: "Sigo aquí",
    achievements: "Logros o responsabilidades",
    education: "Educación",
    eduNum: "Estudio #",
    degree: "Grado o Título",
    institution: "Institución",
    year: "Año",
    certs: "Certificados y Entrenamientos",
    certNum: "Certificado #",
    certName: "Nombre del certificado o entrenamiento",
    issuer: "Institución / Impartido por",
    skills: "Habilidades",
    skillNum: "Habilidad #",
    confirmClear: "¿Estás seguro de que deseas borrar todo el formulario?",
    mobileTitle: "Experiencia de Escritorio Recomendada",
    mobileDesc: "My Free CV está diseñado para funcionar mejor en pantallas grandes. La experiencia de diseño, edición y exportación será mucho más cómoda desde una computadora en lugar de un teléfono móvil.",
    mobileBtn: "Entendido, continuar",
    // Para el PDF
    pdfTitleSummary: "Perfil Profesional",
    pdfTitleExp: "Experiencia Laboral",
    pdfTitleEdu: "Educación",
    pdfTitleCerts: "Certificados y Entrenamientos",
    pdfTitleSkills: "Habilidades",
    present: "Presente"
  },
  en: {
    appTitle: "My Free CV",
    clear: "Clear",
    export: "Export PDF",
    preparing: "Preparing...",
    personalInfo: "Personal Details",
    name: "Full Name",
    role: "Professional Title",
    email: "Email Address",
    phone: "Phone Number",
    location: "Location (e.g. City, Country)",
    summary: "Professional Summary",
    experience: "Work Experience",
    add: "Add",
    expNum: "Experience #",
    position: "Job Title",
    company: "Company",
    startYear: "From (Year)",
    endYear: "To (Year)",
    current: "I currently work here",
    achievements: "Key Achievements / Responsibilities",
    education: "Education",
    eduNum: "Education #",
    degree: "Degree or Certificate",
    institution: "Institution",
    year: "Year",
    certs: "Certifications & Training",
    certNum: "Certification #",
    certName: "Certification / Training Name",
    issuer: "Issuing Organization",
    skills: "Skills",
    skillNum: "Skill #",
    confirmClear: "Are you sure you want to clear the entire form?",
    mobileTitle: "Desktop Experience Recommended",
    mobileDesc: "My Free CV is designed to work best on larger screens. The layout, editing, and exporting experience will be much more comfortable on a computer rather than a mobile phone.",
    mobileBtn: "I understand, continue",
    // Para el PDF
    pdfTitleSummary: "Professional Profile",
    pdfTitleExp: "Work Experience",
    pdfTitleEdu: "Education",
    pdfTitleCerts: "Certifications & Training",
    pdfTitleSkills: "Skills",
    present: "Present"
  }
};

const emptyData = {
  fullName: '', title: '', email: '', phone: '', location: '', summary: '',
  experiences: [{ company: '', position: '', startYear: '', endYear: '', current: false, description: '' }],
  education: [{ institution: '', degree: '', year: '' }],
  skills: [{ name: '' }],
  certifications: [{ name: '', year: '', issuer: '' }]
};

function App() {
  // Estado de Idioma
  const [lang, setLang] = useState(() => localStorage.getItem('appLang') || 'es');
  const t = translations[lang];

  // Estado de Tema (Dark/Light)
  const [theme, setTheme] = useState(() => localStorage.getItem('appTheme') || 'dark');

  // Estado de Advertencia Móvil (Evaluado directamente al montar - QA FIX)
  const [showMobileWarning, setShowMobileWarning] = useState(() => {
    const isMobile = window.innerWidth < 768;
    const warningSeen = sessionStorage.getItem('mobileWarningSeen');
    return isMobile && !warningSeen;
  });

  // Inicializar estado con control de excepciones
  const [cv, setCv] = useState(() => {
    try {
      const savedCv = localStorage.getItem('cvData');
      if (savedCv) {
        const parsed = JSON.parse(savedCv);
        const safeExperiences = (parsed.experiences || []).map(exp => ({
          ...exp,
          startYear: exp.startYear || '', endYear: exp.endYear || '', current: exp.current || false
        }));
        return {
          ...emptyData, ...parsed,
          experiences: safeExperiences.length ? safeExperiences : emptyData.experiences,
          skills: parsed.skills || [{ name: '' }],
          certifications: parsed.certifications || [{ name: '', year: '', issuer: '' }]
        };
      }
    } catch (error) {
      console.error("Corrupted CV data in localStorage. Resetting...", error);
      localStorage.removeItem('cvData');
    }
    return emptyData;
  });

  // Efectos (Guardado y Tema)
  useEffect(() => {
    localStorage.setItem('cvData', JSON.stringify(cv));
  }, [cv]);

  useEffect(() => {
    localStorage.setItem('appLang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('appTheme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Manejadores
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang(prev => prev === 'es' ? 'en' : 'es');
  const dismissMobileWarning = () => {
    sessionStorage.setItem('mobileWarningSeen', 'true');
    setShowMobileWarning(false);
  };

  const handleTextChange = (field, val) => setCv(prev => ({ ...prev, [field]: val }));
  const handleExpChange = (idx, field, val) => {
    const updated = [...cv.experiences];
    updated[idx][field] = val;
    if (field === 'current' && val === true) updated[idx].endYear = '';
    setCv(prev => ({ ...prev, experiences: updated }));
  };
  const handleEduChange = (idx, field, val) => {
    const updated = [...cv.education];
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
    updated[idx][field] = val;
    setCv(prev => ({ ...prev, certifications: updated }));
  };

  // Agregar y eliminar (con aria-labels para Accesibilidad)
  const addExperience = () => setCv(prev => ({ ...prev, experiences: [...prev.experiences, { company: '', position: '', startYear: '', endYear: '', current: false, description: '' }] }));
  const removeExperience = (idx) => setCv(prev => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== idx) }));
  
  const addEducation = () => setCv(prev => ({ ...prev, education: [...prev.education, { institution: '', degree: '', year: '' }] }));
  const removeEducation = (idx) => setCv(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }));
  
  const addSkill = () => setCv(prev => ({ ...prev, skills: [...prev.skills, { name: '' }] }));
  const removeSkill = (idx) => setCv(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }));
  
  const addCertification = () => setCv(prev => ({ ...prev, certifications: [...prev.certifications, { name: '', year: '', issuer: '' }] }));
  const removeCertification = (idx) => setCv(prev => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== idx) }));

  const resetForm = () => {
    if(window.confirm(t.confirmClear)) setCv(emptyData);
  };

  const formatPeriod = (start, end, isCurrent) => {
    const endDate = isCurrent ? t.present : end;
    return [start, endDate].filter(Boolean).join(' - ');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 p-6 md:p-10 transition-colors duration-300">
      
      {/* Modal de Advertencia Móvil */}
      {showMobileWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-2xl max-w-sm text-center border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.mobileTitle}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{t.mobileDesc}</p>
            <button 
              onClick={dismissMobileWarning} 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {t.mobileBtn}
            </button>
          </div>
        </div>
      )}

      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pb-6 border-b border-slate-300 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
          <h1 className="text-2xl font-bold tracking-tight">{t.appTitle}</h1>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Controles de Configuración */}
          <div className="flex bg-white dark:bg-[#111111] border border-slate-300 dark:border-slate-800 rounded-lg p-1 mr-2 shadow-sm">
            <button onClick={toggleLang} aria-label="Cambiar idioma" title="Language" className="p-2 text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
              <Globe className="w-4 h-4" />
            </button>
            <div className="w-px bg-slate-300 dark:bg-slate-800 mx-1"></div>
            <button onClick={toggleTheme} aria-label="Alternar tema" title="Dark/Light Mode" className="p-2 text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <button 
            onClick={resetForm}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white hover:bg-slate-100 dark:bg-[#111111] dark:hover:bg-slate-900 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors border border-slate-300 dark:border-slate-800 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            {t.clear}
          </button>
          
          <PDFDownloadLink
            document={<CvPdfDocument data={cv} dict={t} />}
            fileName={`CV_${(cv.fullName || 'Curriculum').replace(/\s+/g, '_')}.pdf`}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            {({ loading }) => (
              <>
                <Download className="w-4 h-4" />
                <span>{loading ? t.preparing : t.export}</span>
              </>
            )}
          </PDFDownloadLink>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <section className="space-y-6 lg:col-span-7">
          
          {/* Datos Personales */}
          <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{t.personalInfo}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="input-field" placeholder={t.name} value={cv.fullName} onChange={e => handleTextChange('fullName', e.target.value)} />
              <input className="input-field" placeholder={t.role} value={cv.title} onChange={e => handleTextChange('title', e.target.value)} />
              <input className="input-field" placeholder={t.email} value={cv.email} onChange={e => handleTextChange('email', e.target.value)} />
              <input className="input-field" placeholder={t.phone} value={cv.phone} onChange={e => handleTextChange('phone', e.target.value)} />
              <input className="input-field md:col-span-2" placeholder={t.location} value={cv.location} onChange={e => handleTextChange('location', e.target.value)} />
            </div>
            <textarea rows={3} className="input-field resize-none w-full" placeholder={t.summary} value={cv.summary} onChange={e => handleTextChange('summary', e.target.value)} />
          </div>

          {/* Experiencia Laboral */}
          <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{t.experience}</h2>
              <button type="button" onClick={addExperience} className="btn-add">
                <Plus className="w-3.5 h-3.5" /> {t.add}
              </button>
            </div>
            {cv.experiences.map((exp, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-[#111111] rounded-lg border border-slate-200 dark:border-slate-800 space-y-3 relative">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.expNum}{i + 1}</span>
                  <button aria-label="Eliminar" type="button" onClick={() => removeExperience(i)} className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input className="input-field" placeholder={t.position} value={exp.position} onChange={e => handleExpChange(i, 'position', e.target.value)} />
                  <input className="input-field" placeholder={t.company} value={exp.company} onChange={e => handleExpChange(i, 'company', e.target.value)} />
                </div>
                
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                  <input className="input-field flex-1" placeholder={t.startYear} value={exp.startYear} onChange={e => handleExpChange(i, 'startYear', e.target.value)} />
                  <input className="input-field flex-1 disabled:opacity-50 disabled:cursor-not-allowed" placeholder={t.endYear} value={exp.endYear} onChange={e => handleExpChange(i, 'endYear', e.target.value)} disabled={exp.current} />
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer ml-1">
                    <input type="checkbox" className="rounded bg-white dark:bg-[#111111] border-slate-300 dark:border-slate-700 text-indigo-500" checked={exp.current} onChange={e => handleExpChange(i, 'current', e.target.checked)} />
                    {t.current}
                  </label>
                </div>
                <textarea rows={2} className="input-field resize-none w-full" placeholder={t.achievements} value={exp.description} onChange={e => handleExpChange(i, 'description', e.target.value)} />
              </div>
            ))}
          </div>

          {/* Educación */}
          <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{t.education}</h2>
              <button type="button" onClick={addEducation} className="btn-add">
                <Plus className="w-3.5 h-3.5" /> {t.add}
              </button>
            </div>
            {cv.education.map((edu, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-[#111111] rounded-lg border border-slate-200 dark:border-slate-800 space-y-2 relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.eduNum}{i + 1}</span>
                  <button aria-label="Eliminar" type="button" onClick={() => removeEducation(i)} className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input className="input-field w-full" placeholder={t.degree} value={edu.degree} onChange={e => handleEduChange(i, 'degree', e.target.value)} />
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <input className="input-field col-span-3" placeholder={t.institution} value={edu.institution} onChange={e => handleEduChange(i, 'institution', e.target.value)} />
                  <input className="input-field col-span-1" placeholder={t.year} value={edu.year} onChange={e => handleEduChange(i, 'year', e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          {/* Certificados y Entrenamientos */}
          <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{t.certs}</h2>
              <button type="button" onClick={addCertification} className="btn-add">
                <Plus className="w-3.5 h-3.5" /> {t.add}
              </button>
            </div>
            {cv.certifications.map((cert, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-[#111111] rounded-lg border border-slate-200 dark:border-slate-800 space-y-2 relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.certNum}{i + 1}</span>
                  <button aria-label="Eliminar" type="button" onClick={() => removeCertification(i)} className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input className="input-field w-full" placeholder={t.certName} value={cert.name} onChange={e => handleCertChange(i, 'name', e.target.value)} />
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <input className="input-field col-span-3" placeholder={t.issuer} value={cert.issuer} onChange={e => handleCertChange(i, 'issuer', e.target.value)} />
                  <input className="input-field col-span-1" placeholder={t.year} value={cert.year} onChange={e => handleCertChange(i, 'year', e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          {/* Habilidades */}
          <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{t.skills}</h2>
              <button type="button" onClick={addSkill} className="btn-add">
                <Plus className="w-3.5 h-3.5" /> {t.add}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cv.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input className="input-field flex-1" placeholder={`${t.skillNum}${i + 1}`} value={skill.name} onChange={e => handleSkillChange(i, e.target.value)} />
                  <button aria-label="Eliminar" type="button" onClick={() => removeSkill(i)} className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 p-2 bg-slate-50 dark:bg-[#111111] rounded-lg border border-slate-200 dark:border-slate-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* COLUMNA DERECHA: VISTA PREVIA (La hoja de papel siempre es blanca) */}
        <section className="lg:col-span-5 relative">
          <div className="sticky top-8 bg-white text-slate-900 p-8 rounded-xl shadow-xl min-h-[600px] border border-slate-200 overflow-hidden">
            
            <div className="border-b-2 border-indigo-600 pb-4 mb-4">
              <h2 className="text-2xl font-bold">{cv.fullName || t.name}</h2>
              <p className="text-indigo-600 font-medium text-sm">{cv.title || t.role}</p>
              <p className="text-slate-500 text-[11px] mt-1">
                {[cv.email, cv.phone, cv.location].filter(Boolean).join(' • ')}
              </p>
            </div>

            {cv.summary && (
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1 mb-2">{t.pdfTitleSummary}</h3>
                <p className="text-[11px] text-slate-700 leading-relaxed text-justify">{cv.summary}</p>
              </div>
            )}

            {cv.experiences.length > 0 && cv.experiences.some(e => e.position || e.company) && (
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1 mb-2">{t.pdfTitleExp}</h3>
                {cv.experiences.map((exp, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between text-xs font-semibold text-slate-800">
                      <span>{exp.position}</span>
                      <span className="text-slate-500 font-normal text-[10px]">
                        {formatPeriod(exp.startYear, exp.endYear, exp.current)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 italic">{exp.company}</div>
                    <p className="text-[11px] text-slate-700 mt-1 leading-relaxed text-justify">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {cv.education.length > 0 && cv.education.some(e => e.degree || e.institution) && (
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1 mb-2">{t.pdfTitleEdu}</h3>
                {cv.education.map((edu, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-800">
                      <span>{edu.degree}</span>
                      <span className="text-slate-500 font-normal text-[10px]">{edu.year}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">{edu.institution}</div>
                  </div>
                ))}
              </div>
            )}

            {cv.certifications.length > 0 && cv.certifications.some(c => c.name) && (
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1 mb-2">{t.pdfTitleCerts}</h3>
                {cv.certifications.map((cert, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-800">
                      <span>{cert.name}</span>
                      <span className="text-slate-500 font-normal text-[10px]">{cert.year}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">{cert.issuer}</div>
                  </div>
                ))}
              </div>
            )}

            {cv.skills.length > 0 && cv.skills.some(s => s.name) && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1 mb-2">{t.pdfTitleSkills}</h3>
                <ol className="list-decimal list-inside text-[11px] text-slate-700 space-y-1">
                  {cv.skills.filter(s => s.name).map((skill, i) => (
                    <li key={i}>{skill.name}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Clases CSS dinámicas extraídas por limpieza en el JSX */}
      <style>{`
        .input-field {
          @apply bg-slate-50 dark:bg-[#111111] border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors;
        }
        .btn-add {
          @apply flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-3 py-1.5 rounded-md transition-colors;
        }
      `}</style>
    </div>
  );
}

export default App;