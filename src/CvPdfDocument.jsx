import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 'bold' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-italic.ttf', fontStyle: 'italic' },
  ]
});

const getStyles = (template) => {
  const baseColors = {
    standard: { primary: '#3b82f6', text: '#334155', title: '#0f172a' },
    harvard: { primary: '#000000', text: '#000000', title: '#000000' },
    awesome: { primary: '#e11d48', text: '#334155', title: '#0f172a' },
    minimalist: { primary: '#475569', text: '#475569', title: '#1e293b' },
    creative: { primary: '#1e293b', text: '#334155', title: '#0f172a', sidebar: '#1e293b', sidebarText: '#f8fafc' },
  };
  const c = baseColors[template] || baseColors.standard;
  const isHarvard = template === 'harvard';
  const isCreative = template === 'creative';
  
  return StyleSheet.create({
    page: { 
      padding: isCreative ? 0 : 40, 
      flexDirection: isCreative ? 'row' : 'column',
      fontFamily: isHarvard ? 'Times-Roman' : 'Open Sans', 
      color: c.text 
    },
    
    // CREATIVE SIDEBAR
    creativeSidebar: {
      width: '35%',
      backgroundColor: c.sidebar,
      padding: 30,
      color: c.sidebarText,
      minHeight: '100vh',
    },
    creativeMain: {
      width: '65%',
      padding: 30,
      backgroundColor: '#ffffff'
    },
    creativePhoto: {
      width: 90, height: 90, borderRadius: 45, objectFit: 'cover',
      marginBottom: 15, alignSelf: 'center',
      border: '3pt solid #475569'
    },
    creativeName: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', textAlign: 'center', marginBottom: 4 },
    creativeRole: { fontSize: 11, color: '#818cf8', textAlign: 'center', marginBottom: 20, textTransform: 'uppercase' },
    creativeContactLabel: { fontSize: 10, fontWeight: 'bold', color: '#ffffff', marginTop: 10, marginBottom: 2 },
    creativeContactText: { fontSize: 10, color: '#cbd5e1', marginBottom: 5 },
    creativeSkillTitle: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#475569', paddingBottom: 4, marginTop: 25, marginBottom: 10 },
    creativeSkillText: { fontSize: 10, color: '#e2e8f0', marginBottom: 4 },

    // ESTILOS COMUNES
    header: { 
      flexDirection: isHarvard ? 'column' : 'row', 
      alignItems: isHarvard ? 'center' : 'center', 
      borderBottomWidth: 2, 
      borderBottomColor: isHarvard ? '#000000' : c.primary, 
      paddingBottom: 12, 
      marginBottom: 16 
    },
    photo: { 
      width: 70, height: 70, borderRadius: 35, objectFit: 'cover', 
      marginRight: isHarvard ? 0 : 18, 
      marginBottom: isHarvard ? 10 : 0 
    },
    headerTextContainer: { 
      flex: 1, 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: isHarvard ? 'center' : 'flex-start' 
    },
    name: { 
      fontSize: isHarvard ? 26 : 24, 
      fontWeight: 'bold', 
      color: c.title,
      textTransform: isHarvard ? 'uppercase' : 'none'
    },
    role: { fontSize: 14, color: c.primary, marginTop: 4, fontStyle: isHarvard ? 'italic' : 'normal', fontWeight: isHarvard ? 'bold' : 'normal' },
    contact: { fontSize: 10, color: '#64748b', marginTop: 6 },
    
    section: { marginTop: 16, width: '100%' }, 
    sectionTitle: { 
      fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', 
      color: template === 'awesome' ? '#be123c' : (isCreative ? '#4f46e5' : c.title), 
      borderBottomWidth: isCreative ? 2 : 1, 
      borderBottomColor: isHarvard ? '#000' : (isCreative ? '#f1f5f9' : '#cbd5e1'), 
      paddingBottom: 4, marginBottom: 10,
      textAlign: isHarvard ? 'center' : 'left'
    },
    
    item: { 
      marginBottom: 14, width: '100%',
      flexDirection: template === 'minimalist' ? 'row' : 'column'
    },
    itemLeftCol: { width: '22%', paddingRight: 10, alignItems: 'flex-end' },
    itemRightCol: { width: template === 'minimalist' ? '78%' : '100%' },
    
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 },
    itemTitleContainer: { flex: 1, paddingRight: 10 },
    itemTitle: { fontWeight: 'bold', fontSize: 12, color: c.title },
    itemDate: { fontSize: 10, color: '#64748b', textAlign: 'right', minWidth: 80, fontWeight: template === 'minimalist' ? 'bold' : 'normal' },
    itemSubtitle: { 
      fontSize: 11, 
      color: template === 'harvard' ? '#000' : (template === 'awesome' ? '#e11d48' : (isCreative ? '#64748b' : c.primary)), 
      fontStyle: isHarvard ? 'italic' : 'normal',
      fontWeight: isHarvard ? 'normal' : 'bold',
      marginBottom: 5 
    },
    
    itemDesc: { width: '100%', fontSize: 10, color: c.text, lineHeight: 1.5, textAlign: 'justify' },
    skillItem: { width: '100%', fontSize: 10, color: c.text, lineHeight: 1.5, marginLeft: 8, marginBottom: 2 }
  });
};

const formatPeriod = (start, end, isCurrent, dict) => {
  const endDate = isCurrent ? dict.present : end;
  return [start, endDate].filter(Boolean).join(' - ');
};

export const CvPdfDocument = ({ data, dict, template = 'standard' }) => {
  const styles = getStyles(template);
  const isMinimalist = template === 'minimalist';
  const isCreative = template === 'creative';

  // Usamos una función de renderizado en lugar de un Componente Anidado para evitar errores de linter
  const renderMainContent = () => (
    <>
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
              {isMinimalist && (
                <View style={styles.itemLeftCol}>
                  <Text style={styles.itemDate}>{formatPeriod(exp.startYear, exp.endYear, exp.current, dict)}</Text>
                </View>
              )}
              <View style={styles.itemRightCol}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemTitleContainer}>
                    <Text style={styles.itemTitle}>{exp.position}</Text>
                  </View>
                  {!isMinimalist && (
                    <Text style={styles.itemDate}>{formatPeriod(exp.startYear, exp.endYear, exp.current, dict)}</Text>
                  )}
                </View>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                {exp.description ? <Text style={styles.itemDesc}>{exp.description}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      )}

      {data.education?.length > 0 && data.education.some(e => e.degree || e.institution) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{dict.pdfTitleEdu}</Text>
          {data.education.map((edu, i) => (
            <View key={i} style={styles.item}>
              {isMinimalist && (
                <View style={styles.itemLeftCol}>
                  <Text style={styles.itemDate}>{edu.year}</Text>
                </View>
              )}
              <View style={styles.itemRightCol}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemTitleContainer}>
                    <Text style={styles.itemTitle}>{edu.degree}</Text>
                  </View>
                  {!isMinimalist && <Text style={styles.itemDate}>{edu.year}</Text>}
                </View>
                <Text style={styles.itemSubtitle}>{edu.institution}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {data.certifications?.length > 0 && data.certifications.some(c => c.name) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{dict.pdfTitleCerts}</Text>
          {data.certifications.map((cert, i) => (
            <View key={i} style={styles.item}>
              {isMinimalist && (
                <View style={styles.itemLeftCol}>
                  <Text style={styles.itemDate}>{cert.year}</Text>
                </View>
              )}
              <View style={styles.itemRightCol}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemTitleContainer}>
                    <Text style={styles.itemTitle}>{cert.name}</Text>
                  </View>
                  {!isMinimalist && <Text style={styles.itemDate}>{cert.year}</Text>}
                </View>
                <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {!isCreative && data.skills?.length > 0 && data.skills.some(s => s.name) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{dict.pdfTitleSkills}</Text>
          {data.skills.filter(s => s.name).map((skill, i) => (
            <View key={i} style={{ flexDirection: 'row', width: '100%' }}>
              <Text style={styles.skillItem}>• {skill.name}</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {isCreative ? (
          <>
            <View style={styles.creativeSidebar}>
              {data.photo && <Image src={data.photo} style={styles.creativePhoto} />}
              <Text style={styles.creativeName}>{data.fullName || dict.name}</Text>
              <Text style={styles.creativeRole}>{data.title || dict.role}</Text>
              
              {data.email && (
                <View>
                  <Text style={styles.creativeContactLabel}>Email</Text>
                  <Text style={styles.creativeContactText}>{data.email}</Text>
                </View>
              )}
              {data.phone && (
                <View>
                  <Text style={styles.creativeContactLabel}>Phone</Text>
                  <Text style={styles.creativeContactText}>{data.phone}</Text>
                </View>
              )}
              {data.location && (
                <View>
                  <Text style={styles.creativeContactLabel}>Location</Text>
                  <Text style={styles.creativeContactText}>{data.location}</Text>
                </View>
              )}

              {data.skills?.length > 0 && data.skills.some(s => s.name) && (
                <View>
                  <Text style={styles.creativeSkillTitle}>{dict.pdfTitleSkills}</Text>
                  {data.skills.filter(s => s.name).map((skill, i) => (
                    <Text key={i} style={styles.creativeSkillText}>• {skill.name}</Text>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.creativeMain}>
              {renderMainContent()}
            </View>
          </>
        ) : (
          <>
            <View style={styles.header}>
              {data.photo && <Image src={data.photo} style={styles.photo} />}
              <View style={styles.headerTextContainer}>
                <Text style={styles.name}>{data.fullName || dict.name}</Text>
                <Text style={styles.role}>{data.title || dict.role}</Text>
                <Text style={styles.contact}>
                  {[data.email, data.phone, data.location].filter(Boolean).join('  |  ')}
                </Text>
              </View>
            </View>
            {renderMainContent()}
          </>
        )}

      </Page>
    </Document>
  );
};