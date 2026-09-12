import { useState, useEffect } from 'react';
import { FileText, Download, Plus, Trash2, RotateCcw } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CvPdfDocument } from './CvPdfDocument';

const initialData = {
  fullName: 'Geovanny Alvarado',
  title: 'Ingeniero de Software Backend',
  email: 'contacto@galvarado.dev',
  phone: '+52 999 000 0000',
  location: 'Mérida, Yucatán',
  summary: 'Ingeniero de software enfocado en desarrollo de backend, diseño de APIs robustas y arquitecturas en la nube.',
  experiences: [
    { company: 'Tech Solutions', position: 'Backend Engineer', period: '2023 - Presente', description: 'Desarrollo de servicios RESTful, integración con bases de datos y optimización de flujos de datos.' }
  ],
  education: [
    { institution: 'Universidad Tecnológica', degree: 'Ing. en Tecnologías de la Información', year: '2022' }
  ]
};

const emptyData = {
  fullName: '', title: '', email: '', phone: '', location: '', summary: '',
  experiences: [{ company: '', position: '', period: '', description: '' }],
  education: [{ institution: '', degree: '', year: '' }]
};

function App() {
  // Inicializar estado desde localStorage o usar los datos iniciales
  const [cv, setCv] = useState(() => {
    const savedCv = localStorage.getItem('cvData');
    return savedCv ? JSON.parse(savedCv) : initialData;
  });

  // Guardar en localStorage cada vez que el estado 'cv' cambie
  useEffect(() => {
    localStorage.setItem('cvData', JSON.stringify(cv));
  }, [cv]);

  // Manejadores de cambios
  const handleTextChange = (field, val) => setCv(prev => ({ ...prev, [field]: val }));

  const handleExpChange = (idx, field, val) => {
    const updated = [...cv.experiences];
    updated[idx][field] = val;
    setCv(prev => ({ ...prev, experiences: updated }));
  };

  const handleEduChange = (idx, field, val) => {
    const updated = [...cv.education];
    updated[idx][field] = val;
    setCv(prev => ({ ...prev, education: updated }));
  };

  // Agregar y eliminar elementos (Experiencia)
  const addExperience = () => setCv(prev => ({
    ...prev,
    experiences: [...prev.experiences, { company: '', position: '', period: '', description: '' }]
  }));
  const removeExperience = (idx) => setCv(prev => ({
    ...prev,
    experiences: prev.experiences.filter((_, i) => i !== idx)
  }));

  // Agregar y eliminar elementos (Educación)
  const addEducation = () => setCv(prev => ({
    ...prev,
    education: [...prev.education, { institution: '', degree: '', year: '' }]
  }));
  const removeEducation = (idx) => setCv(prev => ({
    ...prev,
    education: prev.education.filter((_, i) => i !== idx)
  }));

  // Reiniciar formulario
  const resetForm = () => {
    if(window.confirm('¿Estás seguro de que deseas borrar todo el formulario?')) {
      setCv(emptyData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-indigo-400" />
          <h1 className="text-2xl font-bold tracking-tight">CV Generator</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={resetForm}
            className="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors border border-slate-800"
          >
            <RotateCcw className="w-4 h-4" />
            Limpiar
          </button>
          
          <PDFDownloadLink
            document={<CvPdfDocument data={cv} />}
            fileName={`CV_${cv.fullName.replace(/\s+/g, '_') || 'Curriculum'}.pdf`}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            {({ loading }) => (
              <>
                <Download className="w-4 h-4" />
                <span>{loading ? 'Preparando...' : 'Exportar PDF'}</span>
              </>
            )}
          </PDFDownloadLink>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <section className="space-y-6 lg:col-span-7">
          
          {/* Datos Personales */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">Datos Personales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                placeholder="Nombre completo"
                value={cv.fullName}
                onChange={e => handleTextChange('fullName', e.target.value)}
              />
              <input
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                placeholder="Rol o título profesional"
                value={cv.title}
                onChange={e => handleTextChange('title', e.target.value)}
              />
              <input
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                placeholder="Correo electrónico"
                value={cv.email}
                onChange={e => handleTextChange('email', e.target.value)}
              />
              <input
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                placeholder="Ubicación"
                value={cv.location}
                onChange={e => handleTextChange('location', e.target.value)}
              />
            </div>
            <textarea
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 resize-none"
              placeholder="Resumen o perfil profesional"
              value={cv.summary}
              onChange={e => handleTextChange('summary', e.target.value)}
            />
          </div>

          {/* Experiencia Laboral */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">Experiencia Laboral</h2>
              <button
                type="button"
                onClick={addExperience}
                className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>
            {cv.experiences.map((exp, i) => (
              <div key={i} className="p-4 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-2 relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400 font-medium">Experiencia #{i + 1}</span>
                  <button type="button" onClick={() => removeExperience(i)} className="text-rose-400 hover:text-rose-300 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="Puesto"
                    value={exp.position}
                    onChange={e => handleExpChange(i, 'position', e.target.value)}
                  />
                  <input
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="Empresa"
                    value={exp.company}
                    onChange={e => handleExpChange(i, 'company', e.target.value)}
                  />
                </div>
                <input
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                  placeholder="Periodo (ej. 2022 - 2024)"
                  value={exp.period}
                  onChange={e => handleExpChange(i, 'period', e.target.value)}
                />
                <textarea
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Logros o responsabilidades"
                  value={exp.description}
                  onChange={e => handleExpChange(i, 'description', e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Educación */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">Educación</h2>
              <button
                type="button"
                onClick={addEducation}
                className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>
            {cv.education.map((edu, i) => (
              <div key={i} className="p-4 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-2 relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400 font-medium">Estudio #{i + 1}</span>
                  <button type="button" onClick={() => removeEducation(i)} className="text-rose-400 hover:text-rose-300 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                  placeholder="Grado o Título"
                  value={edu.degree}
                  onChange={e => handleEduChange(i, 'degree', e.target.value)}
                />
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <input
                    className="col-span-3 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="Institución"
                    value={edu.institution}
                    onChange={e => handleEduChange(i, 'institution', e.target.value)}
                  />
                  <input
                    className="col-span-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="Año"
                    value={edu.year}
                    onChange={e => handleEduChange(i, 'year', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* COLUMNA DERECHA: VISTA PREVIA */}
        <section className="lg:col-span-5 relative">
          {/* Contenedor pegajoso (sticky) para que la vista previa siga al hacer scroll */}
          <div className="sticky top-8 bg-white text-slate-900 p-8 rounded-xl shadow-xl min-h-[600px] border border-slate-200">
            
            <div className="border-b-2 border-indigo-600 pb-4 mb-4">
              <h2 className="text-2xl font-bold">{cv.fullName || 'Tu Nombre'}</h2>
              <p className="text-indigo-600 font-medium text-sm">{cv.title || 'Título Profesional'}</p>
              <p className="text-slate-500 text-[11px] mt-1">
                {[cv.email, cv.phone, cv.location].filter(Boolean).join(' • ')}
              </p>
            </div>

            {cv.summary && (
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1 mb-2">Perfil Profesional</h3>
                <p className="text-[11px] text-slate-700 leading-relaxed">{cv.summary}</p>
              </div>
            )}

            {cv.experiences.length > 0 && cv.experiences.some(e => e.position || e.company) && (
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1 mb-2">Experiencia</h3>
                {cv.experiences.map((exp, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between text-xs font-semibold text-slate-800">
                      <span>{exp.position}</span>
                      <span className="text-slate-500 font-normal text-[10px]">{exp.period}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 italic">{exp.company}</div>
                    <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {cv.education.length > 0 && cv.education.some(e => e.degree || e.institution) && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1 mb-2">Educación</h3>
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
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;