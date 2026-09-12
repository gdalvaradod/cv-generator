import { useState, useEffect } from 'react';
import { FileText, Download, Plus, Trash2, RotateCcw } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CvPdfDocument } from './CvPdfDocument';

const emptyData = {
  fullName: '', title: '', email: '', phone: '', location: '', summary: '',
  experiences: [{ company: '', position: '', startYear: '', endYear: '', current: false, description: '' }],
  education: [{ institution: '', degree: '', year: '' }],
  skills: [{ name: '' }],
  certifications: [{ name: '', year: '', issuer: '' }]
};

function App() {
  // Inicializar estado desde localStorage o usar los datos limpios por defecto
  const [cv, setCv] = useState(() => {
    const savedCv = localStorage.getItem('cvData');
    if (savedCv) {
      const parsed = JSON.parse(savedCv);
      // Aseguramos que los nuevos campos de experiencia existan si hay datos guardados viejos
      const safeExperiences = (parsed.experiences || []).map(exp => ({
        ...exp,
        startYear: exp.startYear || '',
        endYear: exp.endYear || '',
        current: exp.current || false
      }));

      return {
        ...emptyData,
        ...parsed,
        experiences: safeExperiences.length ? safeExperiences : emptyData.experiences,
        skills: parsed.skills || [{ name: '' }],
        certifications: parsed.certifications || [{ name: '', year: '', issuer: '' }]
      };
    }
    return emptyData;
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
    // Si marcan "actualmente", limpiamos el campo "Hasta"
    if (field === 'current' && val === true) {
      updated[idx].endYear = '';
    }
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

  // Agregar y eliminar elementos
  const addExperience = () => setCv(prev => ({
    ...prev, experiences: [...prev.experiences, { company: '', position: '', startYear: '', endYear: '', current: false, description: '' }]
  }));
  const removeExperience = (idx) => setCv(prev => ({
    ...prev, experiences: prev.experiences.filter((_, i) => i !== idx)
  }));

  const addEducation = () => setCv(prev => ({
    ...prev, education: [...prev.education, { institution: '', degree: '', year: '' }]
  }));
  const removeEducation = (idx) => setCv(prev => ({
    ...prev, education: prev.education.filter((_, i) => i !== idx)
  }));

  const addSkill = () => setCv(prev => ({
    ...prev, skills: [...prev.skills, { name: '' }]
  }));
  const removeSkill = (idx) => setCv(prev => ({
    ...prev, skills: prev.skills.filter((_, i) => i !== idx)
  }));

  const addCertification = () => setCv(prev => ({
    ...prev, certifications: [...prev.certifications, { name: '', year: '', issuer: '' }]
  }));
  const removeCertification = (idx) => setCv(prev => ({
    ...prev, certifications: prev.certifications.filter((_, i) => i !== idx)
  }));

  // Reiniciar formulario
  const resetForm = () => {
    if(window.confirm('¿Estás seguro de que deseas borrar todo el formulario?')) {
      setCv(emptyData);
    }
  };

  // Función de ayuda para formatear el periodo de experiencia
  const formatPeriod = (start, end, isCurrent) => {
    const endDate = isCurrent ? 'Presente' : end;
    return [start, endDate].filter(Boolean).join(' - ');
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
                placeholder="Número telefónico"
                value={cv.phone}
                onChange={e => handleTextChange('phone', e.target.value)}
              />
              <input
                className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                placeholder="Ubicación (Ej. Ciudad, País)"
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
              <div key={i} className="p-4 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-3 relative">
                <div className="flex justify-between items-center mb-1">
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
                
                {/* Nuevos campos de Periodo */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                  <input
                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="Desde (Año)"
                    value={exp.startYear}
                    onChange={e => handleExpChange(i, 'startYear', e.target.value)}
                  />
                  <input
                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
                    placeholder="Hasta (Año)"
                    value={exp.endYear}
                    onChange={e => handleExpChange(i, 'endYear', e.target.value)}
                    disabled={exp.current}
                  />
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer ml-1">
                    <input
                      type="checkbox"
                      className="rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-indigo-500/50"
                      checked={exp.current}
                      onChange={e => handleExpChange(i, 'current', e.target.checked)}
                    />
                    Sigo aquí
                  </label>
                </div>

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

          {/* Certificados y Entrenamientos */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">Certificados y Entrenamientos</h2>
              <button
                type="button"
                onClick={addCertification}
                className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>
            {cv.certifications.map((cert, i) => (
              <div key={i} className="p-4 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-2 relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400 font-medium">Certificado #{i + 1}</span>
                  <button type="button" onClick={() => removeCertification(i)} className="text-rose-400 hover:text-rose-300 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                  placeholder="Nombre del certificado o entrenamiento"
                  value={cert.name}
                  onChange={e => handleCertChange(i, 'name', e.target.value)}
                />
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <input
                    className="col-span-3 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="Institución / Impartido por"
                    value={cert.issuer}
                    onChange={e => handleCertChange(i, 'issuer', e.target.value)}
                  />
                  <input
                    className="col-span-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="Año"
                    value={cert.year}
                    onChange={e => handleCertChange(i, 'year', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Habilidades - MOVIDO AL FINAL */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">Habilidades</h2>
              <button
                type="button"
                onClick={addSkill}
                className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cv.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                    placeholder={`Habilidad #${i + 1}`}
                    value={skill.name}
                    onChange={e => handleSkillChange(i, e.target.value)}
                  />
                  <button type="button" onClick={() => removeSkill(i)} className="text-rose-400 hover:text-rose-300 p-2 bg-slate-800 rounded-lg border border-slate-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* COLUMNA DERECHA: VISTA PREVIA */}
        <section className="lg:col-span-5 relative">
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

            {/* Experiencia */}
            {cv.experiences.length > 0 && cv.experiences.some(e => e.position || e.company) && (
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1 mb-2">Experiencia</h3>
                {cv.experiences.map((exp, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between text-xs font-semibold text-slate-800">
                      <span>{exp.position}</span>
                      <span className="text-slate-500 font-normal text-[10px]">
                        {formatPeriod(exp.startYear, exp.endYear, exp.current)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 italic">{exp.company}</div>
                    <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Educación */}
            {cv.education.length > 0 && cv.education.some(e => e.degree || e.institution) && (
              <div className="mb-4">
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

            {/* Certificados */}
            {cv.certifications.length > 0 && cv.certifications.some(c => c.name) && (
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1 mb-2">Certificados y Entrenamientos</h3>
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

            {/* Habilidades - MOVIDO AL FINAL */}
            {cv.skills.length > 0 && cv.skills.some(s => s.name) && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1 mb-2">Habilidades</h3>
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
    </div>
  );
}

export default App;