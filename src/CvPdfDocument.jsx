import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: 'Helvetica', color: '#1e293b' },
  header: { borderBottomWidth: 1.5, borderBottomColor: '#3b82f6', paddingBottom: 10, marginBottom: 14 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  role: { fontSize: 12, color: '#3b82f6', marginTop: 2 },
  contact: { fontSize: 9, color: '#64748b', marginTop: 4 },
  section: { marginTop: 12 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', color: '#1e293b', borderBottomWidth: 0.5, borderBottomColor: '#cbd5e1', paddingBottom: 3, marginBottom: 6 },
  item: { marginBottom: 8 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontWeight: 'bold', fontSize: 10, color: '#0f172a' },
  itemDate: { fontSize: 8, color: '#64748b' },
  itemSubtitle: { fontSize: 9, color: '#475569', fontStyle: 'italic', marginBottom: 2 },
  itemDesc: { fontSize: 9, color: '#334155', lineHeight: 1.3 }
});

export const CvPdfDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{data.fullName || 'Tu Nombre'}</Text>
        <Text style={styles.role}>{data.title || 'Título Profesional'}</Text>
        <Text style={styles.contact}>
          {[data.email, data.phone, data.location].filter(Boolean).join('  |  ')}
        </Text>
      </View>

      {data.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil Profesional</Text>
          <Text style={styles.itemDesc}>{data.summary}</Text>
        </View>
      )}

      {data.experiences?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiencia Laboral</Text>
          {data.experiences.map((exp, i) => (
            <View key={i} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{exp.position}</Text>
                <Text style={styles.itemDate}>{exp.period}</Text>
              </View>
              <Text style={styles.itemSubtitle}>{exp.company}</Text>
              <Text style={styles.itemDesc}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {data.education?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Educación</Text>
          {data.education.map((edu, i) => (
            <View key={i} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{edu.degree}</Text>
                <Text style={styles.itemDate}>{edu.year}</Text>
              </View>
              <Text style={styles.itemSubtitle}>{edu.institution}</Text>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);