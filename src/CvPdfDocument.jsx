import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// SOLUCIÓN AL BUG: Registrar una fuente TTF externa para que la librería 
// calcule correctamente el ancho de las letras y no corte el texto.
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 'bold' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-italic.ttf', fontStyle: 'italic' },
  ]
});

const styles = StyleSheet.create({
  // Aplicamos la nueva fuente a toda la página
  page: { padding: 40, fontFamily: 'Open Sans', color: '#1e293b' },
  
  header: { borderBottomWidth: 2, borderBottomColor: '#3b82f6', paddingBottom: 12, marginBottom: 16 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  role: { fontSize: 14, color: '#3b82f6', marginTop: 4 },
  contact: { fontSize: 10, color: '#64748b', marginTop: 6 },
  
  section: { marginTop: 16, width: '100%' }, 
  sectionTitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', color: '#1e293b', borderBottomWidth: 1, borderBottomColor: '#cbd5e1', paddingBottom: 4, marginBottom: 10 },
  
  item: { marginBottom: 14, width: '100%' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 },
  itemTitleContainer: { flex: 1, paddingRight: 10 },
  itemTitle: { fontWeight: 'bold', fontSize: 12, color: '#0f172a' },
  itemDate: { fontSize: 10, color: '#64748b', textAlign: 'right', minWidth: 80 },
  
  itemSubtitle: { fontSize: 11, color: '#475569', fontStyle: 'italic', marginBottom: 5 },
  
  // El texto justificado ahora abarcará todo el ancho sin romperse prematuramente
  itemDesc: { fontSize: 10, color: '#334155', lineHeight: 1.5, textAlign: 'justify', width: '100%' },
  skillItem: { fontSize: 10, color: '#334155', lineHeight: 1.5, marginLeft: 8, marginBottom: 2 }
});

export const CvPdfDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.fullName || 'Tu Nombre'}</Text>
        <Text style={styles.role}>{data.title || 'Título Profesional'}</Text>
        <Text style={styles.contact}>
          {[data.email, data.phone, data.location].filter(Boolean).join('  |  ')}
        </Text>
      </View>

      {/* Perfil Profesional */}
      {data.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil Profesional</Text>
          <Text style={styles.itemDesc}>{data.summary}</Text>
        </View>
      )}

      {/* Experiencia Laboral */}
      {data.experiences?.length > 0 && data.experiences.some(e => e.position || e.company) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiencia Laboral</Text>
          {data.experiences.map((exp, i) => (
            <View key={i} style={styles.item}>
              <View style={styles.itemHeader}>
                <View style={styles.itemTitleContainer}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                </View>
                <Text style={styles.itemDate}>
                  {[exp.startYear, exp.current ? 'Presente' : exp.endYear].filter(Boolean).join(' - ')}
                </Text>
              </View>
              <Text style={styles.itemSubtitle}>{exp.company}</Text>
              <Text style={styles.itemDesc}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Educación */}
      {data.education?.length > 0 && data.education.some(e => e.degree || e.institution) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Educación</Text>
          {data.education.map((edu, i) => (
            <View key={i} style={styles.item}>
              <View style={styles.itemHeader}>
                <View style={styles.itemTitleContainer}>
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                </View>
                <Text style={styles.itemDate}>{edu.year}</Text>
              </View>
              <Text style={styles.itemSubtitle}>{edu.institution}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Certificados y Entrenamientos */}
      {data.certifications?.length > 0 && data.certifications.some(c => c.name) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certificados y Entrenamientos</Text>
          {data.certifications.map((cert, i) => (
            <View key={i} style={styles.item}>
              <View style={styles.itemHeader}>
                <View style={styles.itemTitleContainer}>
                  <Text style={styles.itemTitle}>{cert.name}</Text>
                </View>
                <Text style={styles.itemDate}>{cert.year}</Text>
              </View>
              <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Habilidades */}
      {data.skills?.length > 0 && data.skills.some(s => s.name) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          {data.skills.filter(s => s.name).map((skill, i) => (
            <Text key={i} style={styles.skillItem}>{i + 1}. {skill.name}</Text>
          ))}
        </View>
      )}

    </Page>
  </Document>
);