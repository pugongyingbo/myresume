import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface ResumeData {
  personalInfo: {
    name: string;
    phone: string;
    email: string;
    city: string;
    position: string;
  };
  education: Array<{
    school: string;
    major: string;
    degree: string;
    startTime: string;
    endTime: string;
  }>;
  skills: string[];
  workExperience: Array<{
    company: string;
    position: string;
    startTime: string;
    endTime: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    startTime: string;
    endTime: string;
    description: string;
  }>;
  summary?: string[];
}

interface ResumePDFProps {
  data: ResumeData;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'SimSun',
  },
  section: {
    marginBottom: 20, // 增加间距
    breakInside: 'avoid', // 避免段落内部分页
  },
  title: {
    fontSize: 14,
    marginBottom: 8,
    color: '#4169E1',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    marginBottom: 5,
  },
  contact: {
    fontSize: 12,
    color: '#666',
  },
  content: {
    marginBottom: 5,
    lineHeight: 1.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  }
});

const ResumePDF: React.FC<ResumePDFProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page} wrap>
      {/* 个人信息部分保持不变 */}
      
      {/* 教育经历部分保持不变 */}
      
      {/* 专业技能 */}
      <View style={styles.section} break={false}>
        <Text style={styles.title}>专业技能</Text>
        <Text style={styles.content}>{data.skills[0].replace(/<[^>]+>/g, '')}</Text>
      </View>

      {/* 工作经历 */}
      <View style={styles.section} break={false}>
        <Text style={styles.title}>工作经历</Text>
        {data.workExperience.map((work, index) => (
          <View key={index} style={styles.content} break={false}>
            <View style={styles.row}>
              <Text>{work.company} - {work.position}</Text>
              <Text>{work.startTime} - {work.endTime}</Text>
            </View>
            <Text style={styles.content}>{work.description.replace(/<[^>]+>/g, '')}</Text>
          </View>
        ))}
      </View>

      {/* 项目经验 */}
      <View style={styles.section} break={false}>
        <Text style={styles.title}>项目经验</Text>
        {data.projects.map((project, index) => (
          <View key={index} style={styles.content} break={false}>
            <View style={styles.row}>
              <Text>{project.name}</Text>
              <Text>{project.startTime} - {project.endTime}</Text>
            </View>
            <Text style={styles.content}>{project.description.replace(/<[^>]+>/g, '')}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ResumePDF;