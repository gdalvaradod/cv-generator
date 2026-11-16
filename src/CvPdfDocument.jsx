import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 'bold' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-italic.ttf', fontStyle: 'italic' },
  ]
});

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Open Sans', color: '#1e293b' },
  
  // Nuevo layout del Header con Flex Row para soportar la foto
  header: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#3b82f6', paddingBottom: 12, marginBottom: 16 },
  photo: { width: 70, height: 70, borderRadius: 35, objectFit: 'cover', marginRight: 18 },
  headerTextContainer: { flex: 1, flexDirection: 'column', justifyContent: 'center' },
  
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
  
  itemDesc: { width: '100%', fontSize: 10, color: '#334155', lineHeight: 1.5, textAlign: 'justify' },
  skillItem: { width: '100%', fontSize: 10, color: '#334155', lineHeight: 1.5, marginLeft: 8, marginBottom: 2 }
});

export const CvPdfDocument = ({ data, dict }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header con foto opcional */}
      <View style={styles.header}>
        {data.photo && (
          <Image src={data.photo} style={styles.photo} />
        )}
        <View style={styles.headerTextContainer}>
          <Text style={styles.name}>{data.fullName || dict.name}</Text>
          <Text style={styles.role}>{data.title || dict.role}</Text>
          <Text style={styles.contact}>
            {[data.email, data.phone, data.location].filter(Boolean).join('  |  ')}
          </Text>
        </View>
      </View>

      {data.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{dict.pdfTitleSummary}</Text>
          <Text style={styles.itemDesc}>{data.summary}</Text>
        </View>
      )}

      {data.experiences?.length > 0 && data.experiences.some(e => e.position || e.company) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{dict.pdfTitleExp}</Text>
          {data.experiences.map((exp, i) => (
            <View key={i} style={styles.item}>
              <View style={styles.itemHeader}>
                <View style={styles.itemTitleContainer}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                </View>
                <Text style={styles.itemDate}>
                  {[exp.startYear, exp.current ? dict.present : exp.endYear].filter(Boolean).join(' - ')}
                </Text>
              </View>
              <Text style={styles.itemSubtitle}>{exp.company}</Text>
              {exp.description ? <Text style={styles.itemDesc}>{exp.description}</Text> : null}
            </View>
          ))}
        </View>
      )}

      {data.education?.length > 0 && data.education.some(e => e.degree || e.institution) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{dict.pdfTitleEdu}</Text>
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

      {data.certifications?.length > 0 && data.certifications.some(c => c.name) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{dict.pdfTitleCerts}</Text>
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

      {data.skills?.length > 0 && data.skills.some(s => s.name) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{dict.pdfTitleSkills}</Text>
          {data.skills.filter(s => s.name).map((skill, i) => (
            <Text key={i} style={styles.skillItem}>{i + 1}. {skill.name}</Text>
          ))}
        </View>
      )}

    </Page>
  </Document>
);