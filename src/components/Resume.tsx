'use client';

import { useState } from 'react';
import styled from 'styled-components';
import SkillEditor from './SkillEditor';
import { DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'antd/dist/reset.css';
import zhCN from 'antd/locale/zh_CN';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ResumePDF from './ResumePDF';

// 设置 dayjs 的默认语言为中文
dayjs.locale('zh-cn');


// 定义样式组件
const Container = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  min-height: 100vh;
  background: #f5f5f5;
`;

// 添加缺失的样式组件
const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  color: #4169E1;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #4169E1;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #4169E1;
  }
`;

const FormContainer = styled.div<{ $visible: boolean }>`
  flex: 1;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-width: 400px;
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
`;

const PreviewContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Toolbar = styled.div`
  padding: 12px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ResumeContent = styled.div`
  flex: 1;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 210mm;
  margin: 0 auto;
`;

// 添加一个新的样式组件
const AddButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  padding: 4px 8px;
  background: transparent;
  border: 1px solid ${props => props.color || '#4169E1'};
  color: ${props => props.color || '#4169E1'};
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: ${props => props.color || '#4169E1'};
    color: white;
  }
`;
// 添加操作按钮组样式
// 修改 ActionButtons 和 ActionButton 组件，添加类名
const ActionButtons = styled.div.attrs({ className: 'action-buttons' })`
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
`;

const ActionButton = styled.button.attrs(props => ({
  className: props.style?.position === 'absolute' ? 'add-button' : ''
}))`
  padding: 4px 8px;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  
  &:hover {
    background: #e0e0e0;
    color: #333;
  }
`;

const ResumeSection = styled.div<{ color?: string }>`
  margin-bottom: 24px;
  position: relative;
  font-size: 13px;
  
  &:hover ${ActionButtons} {
    opacity: 1;
  }
`;

const ResumeSectionTitle = styled.h2<{ color?: string }>`
  color: ${props => props.color || '#4169E1'};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 0;
  padding-bottom: 8px;
  margin-bottom: 16px;  
  cursor: pointer;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${props => props.color || '#4169E1'};
  
  &:hover {
    opacity: 0.8;
  }
`;
const FormTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
  .back {
    font-size: 14px;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-right: 12px;
  }
  
  .title {
    font-size: 16px;
    font-weight: 500;
  }
  
  .save {
    margin-left: auto;
    padding: 6px 16px;
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    color: #666;
    cursor: pointer;
    
    &:hover {
      border-color: #4169E1;
      color: #4169E1;
    }
  }
`;

const FormField = styled.div`
  margin-bottom: 20px;
  
  .label {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
  }
  
  .hint {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
`;
const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #4169E1;
  }
`;





const Resume = () => {
  const exportPDF = async () => {
    try {
      // 临时隐藏操作按钮
      const actionButtons = document.querySelectorAll('.action-buttons') as NodeListOf<HTMLElement>;
      const addButtons = document.querySelectorAll('.add-button') as NodeListOf<HTMLElement>;
      actionButtons.forEach(btn => (btn.style.display = 'none'));
      addButtons.forEach(btn => (btn.style.display = 'none'));
  
      const content = document.querySelector('.resume-content');
      if (!content) return;
  
      const sections = document.querySelectorAll('.resume-section') as NodeListOf<HTMLElement>;
    sections.forEach(section => {
      section.style.paddingRight = '0';
    });
      const canvas = await html2canvas(content as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: content.scrollWidth,
        windowHeight: content.scrollHeight
      });
  
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      const pdf = new jsPDF('p', 'mm', 'a4');
  
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        0,
        0,
        imgWidth,
        imgHeight
      );
  
      pdf.save('我的简历.pdf');
      // 恢复按钮显示和样式
    actionButtons.forEach(btn => (btn.style.display = ''));
    addButtons.forEach(btn => (btn.style.display = ''));
    sections.forEach(section => {
      section.style.paddingRight = '120px';
    });
    } catch (error) {
      console.error('导出PDF失败:', error);
    }
  };
  // 添加新的状态
  const [lineHeight, setLineHeight] = useState('1.2');
  const [themeColor, setThemeColor] = useState('#4169E1');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    position: ''
  });
  const [education, setEducation] = useState([{
    school: '',
    major: '',
    degree: '',
    startTime: '',
    endTime: ''
  }]);
  const [skills, setSkills] = useState(['']);
  const [workExperience, setWorkExperience] = useState([{
    company: '',
    position: '',
    startTime: '',
    endTime: '',
    description: ''
  }]);
  const [projects, setProjects] = useState([{
    name: '',
    startTime: '',
    endTime: '',
    description: ''
  }]);
  const [summary, setSummary] = useState(['']);


  const renderForm = () => {
    switch (activeSection) {
      case 'personalInfo':
        return (
          <div>
            <FormTitle>
              <span className="back" onClick={() => setActiveSection(null)}>← 返回</span>
              <span className="title">个人信息</span>
    
            </FormTitle>
            <FormField>
              <div className="label">姓名</div>
              <Input
                type="text"
                placeholder="请输入姓名"
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
              />
            </FormField>
            <FormField>
              <div className="label">电话</div>
              <Input
                type="text"
                placeholder="请输入电话"
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
              />
            </FormField>
            <FormField>
              <div className="label">邮箱</div>
              <Input
                type="email"
                placeholder="请输入邮箱"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
              />
            </FormField>
            <FormField>
              <div className="label">当前城市</div>
              <Input
                type="text"
                placeholder="请输入当前所在城市"
                value={personalInfo.city}
                onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })}
              />
            </FormField>
            <FormField>
              <div className="label">期望职位</div>
              <Input
                type="text"
                placeholder="请输入期望职位"
                value={personalInfo.position}
                onChange={(e) => setPersonalInfo({ ...personalInfo, position: e.target.value })}
              />
            </FormField>
          </div>
        );

      case 'education':
        return (
          <div>
            <FormTitle>
              <span className="back" onClick={() => setActiveSection(null)}>← 返回</span>
              <span className="title">教育经历</span>
              
            </FormTitle>
            {education.map((edu, index) => (
              <div key={index}>
                <FormField>
                  <div className="label">学校</div>
                  <Input
                    type="text"
                    placeholder="请输入学校名称"
                    value={edu.school}
                    onChange={(e) => {
                      const newEducation = [...education];
                      newEducation[index].school = e.target.value;
                      setEducation(newEducation);
                    }}
                  />
                </FormField>

                <FormField>
                  <div className="label">专业</div>
                  <Input
                    type="text"
                    placeholder="请输入专业名称"
                    value={edu.major}
                    onChange={(e) => {
                      const newEducation = [...education];
                      newEducation[index].major = e.target.value;
                      setEducation(newEducation);
                    }}
                  />
                </FormField>

                <FormField>
                  <div className="label">学历</div>
                  <Select
                    value={edu.degree}
                    onChange={(e) => {
                      const newEducation = [...education];
                      newEducation[index].degree = e.target.value;
                      setEducation(newEducation);
                    }}
                  >
                    <option value="">请选择学历</option>
                    <option value="大专">大专</option>
                    <option value="本科">本科</option>
                    <option value="硕士">硕士</option>
                    <option value="博士">博士</option>
                  </Select>
                </FormField>

                <FormField>
                  <div className="label">在读时间</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <DatePicker
                      picker="month"
                      placeholder="开始时间"
                      value={edu.startTime ? dayjs(edu.startTime, 'YYYY年MM月') : null}
                      onChange={(date) => {
                        const newEducation = [...education];
                        newEducation[index].startTime = date ? date.format('YYYY年MM月') : '';
                        setEducation(newEducation);
                      }}
                    />
                    <span>至</span>
                    <DatePicker
                      picker="month"
                      placeholder="结束时间"
                      value={edu.endTime ? dayjs(edu.endTime, 'YYYY年MM月') : null}
                      onChange={(date) => {
                        const newEducation = [...education];
                        newEducation[index].endTime = date ? date.format('YYYY年MM月') : '';
                        setEducation(newEducation);
                      }}
                    />
                  </div>
                </FormField>
              </div>
            ))}
          </div>
        );

      case 'skills':
        return (
          <div>
            <FormTitle>
              <span className="back" onClick={() => setActiveSection(null)}>← 返回</span>
              <span className="title">专业技能</span>
             
            </FormTitle>
            <SkillEditor
              content={skills[0] || ''}
              onChange={(content) => {
                setSkills([content]);
              }}
            />
          </div>
        );

      case 'workExperience':
        return (
          <div>
            <FormTitle>
              <span className="back" onClick={() => setActiveSection(null)}>← 返回</span>
              <span className="title">工作经历</span>
              
            </FormTitle>
            {workExperience.map((work, index) => (
              <div key={index}>
                <FormField>
                  <div className="label">公司</div>
                  <Input
                    type="text"
                    placeholder="请输入公司名称"
                    value={work.company}
                    onChange={(e) => {
                      const newWorkExperience = [...workExperience];
                      newWorkExperience[index].company = e.target.value;
                      setWorkExperience(newWorkExperience);
                    }}
                  />
                </FormField>

                <FormField>
                  <div className="label">职位</div>
                  <Input
                    type="text"
                    placeholder="请输入职位名称"
                    value={work.position}
                    onChange={(e) => {
                      const newWorkExperience = [...workExperience];
                      newWorkExperience[index].position = e.target.value;
                      setWorkExperience(newWorkExperience);
                    }}
                  />
                </FormField>

                <FormField>
                  <div className="label">工作时间</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <DatePicker
                      picker="month"
                      placeholder="开始时间"
                      value={work.startTime ? dayjs(work.startTime, 'YYYY年MM月') : null}
                      onChange={(date) => {
                        const newWorkExperience = [...workExperience];
                        newWorkExperience[index].startTime = date ? date.format('YYYY年MM月') : '';
                        setWorkExperience(newWorkExperience);
                      }}
                    />
                    <span>至</span>
                    <DatePicker
                      picker="month"
                      placeholder="结束时间"
                      value={work.endTime ? dayjs(work.endTime, 'YYYY年MM月') : null}
                      onChange={(date) => {
                        const newWorkExperience = [...workExperience];
                        newWorkExperience[index].endTime = date ? date.format('YYYY年MM月') : '';
                        setWorkExperience(newWorkExperience);
                      }}
                    />
                  </div>
                </FormField>

                <FormField>
                  <div className="label">工作描述</div>
                  <SkillEditor
                    content={work.description}
                    onChange={(content) => {
                      const newWorkExperience = [...workExperience];
                      newWorkExperience[index].description = content;
                      setWorkExperience(newWorkExperience);
                    }}
                  />
                </FormField>
              </div>
            ))}
          </div>
        );

      case 'projects':
        return (
          <div>
            <FormTitle>
              <span className="back" onClick={() => setActiveSection(null)}>← 返回</span>
              <span className="title">项目经验</span>
            </FormTitle>
            {projects.map((project, index) => (
              <div key={index}>
                <FormField>
                  <div className="label">项目名称</div>
                  <Input
                    type="text"
                    placeholder="请输入项目名称"
                    value={project.name}
                    onChange={(e) => {
                      const newProjects = [...projects];
                      newProjects[index].name = e.target.value;
                      setProjects(newProjects);
                    }}
                  />
                </FormField>

                <FormField>
                  <div className="label">项目时间</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <DatePicker
                      picker="month"
                      placeholder="开始时间"
                      value={project.startTime ? dayjs(project.startTime, 'YYYY年MM月') : null}
                      onChange={(date) => {
                        const newProjects = [...projects];
                        newProjects[index].startTime = date ? date.format('YYYY年MM月') : '';
                        setProjects(newProjects);
                      }}
                    />
                    <span>至</span>
                    <DatePicker
                      picker="month"
                      placeholder="结束时间"
                      value={project.endTime ? dayjs(project.endTime, 'YYYY年MM月') : null}
                      onChange={(date) => {
                        const newProjects = [...projects];
                        newProjects[index].endTime = date ? date.format('YYYY年MM月') : '';
                        setProjects(newProjects);
                      }}
                    />
                  </div>
                </FormField>

                <FormField>
                  <div className="label">项目描述</div>
                  <SkillEditor
                    content={project.description}
                    onChange={(content) => {
                      const newProjects = [...projects];
                      newProjects[index].description = content;
                      setProjects(newProjects);
                    }}
                  />
                </FormField>
              </div>
            ))}
          </div>
        );

      case 'summary':
        return (
          <div>
            <FormTitle>
              <span className="back" onClick={() => setActiveSection(null)}>← 返回</span>
              <span className="title">个人总结</span>
              
            </FormTitle>
            <SkillEditor
              content={summary[0] || ''}
              onChange={(content) => {
                setSummary([content]);
              }}
            />
          </div>
        );
    }
  };

  return (
    <ConfigProvider locale={zhCN}>
      <Container>
        <FormContainer $visible={activeSection !== null}>
          {renderForm()}
        </FormContainer>
        <PreviewContainer>
          <Toolbar>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>行高</span>
              <select 
                value={lineHeight} 
                onChange={(e) => setLineHeight(e.target.value)}
              >
                <option value="1.0">1.0</option>
                <option value="1.2">1.2</option>
                <option value="1.5">1.5</option>
                <option value="1.8">1.8</option>
                <option value="2.0">2.0</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>主题色</span>
              <input 
                type="color" 
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
              />
            </div>
            <button onClick={exportPDF}>导出PDF</button>
          </Toolbar>
          <ResumeContent className="resume-content" style={{ lineHeight }}>
            <ResumeSection className="resume-section" color={themeColor} onClick={() => setActiveSection('personalInfo')}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer'
              }}>
                <h3 style={{
                  fontSize: '21px',
                  fontWeight: 'bold',
                  margin: '0'
                }}>{personalInfo.name}</h3>
                <p style={{ margin: '0', color: '#666' }}>
                  {personalInfo.phone} | {personalInfo.email} | {personalInfo.city}
                </p>
                <p style={{ margin: '0', color: '#666' }}>{personalInfo.position}</p>
              </div>
            </ResumeSection>

            <ResumeSection className="resume-section" color={themeColor}>
              <ResumeSectionTitle color={themeColor} onClick={() => setActiveSection('education')}>
                教育经历
              </ResumeSectionTitle>
              {education.map((edu, index) => (
                <div key={index} style={{ position: 'relative', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <span style={{ flex: 2 }}>{edu.school}</span>
                    <span style={{ flex: 2 }}>{edu.major}</span>
                    <span style={{ flex: 1 }}>{edu.degree}</span>
                    <span style={{ flex: 2 }}>{edu.startTime} - {edu.endTime}</span>
                  </div>
                  <ActionButtons>
                    <ActionButton onClick={() => {
                      const newEducation = [...education];
                      if (index > 0) {
                        [newEducation[index], newEducation[index - 1]] =
                          [newEducation[index - 1], newEducation[index]];
                        setEducation(newEducation);
                      }
                    }}>↑</ActionButton>
                    <ActionButton onClick={() => {
                      const newEducation = [...education];
                      if (index < education.length - 1) {
                        [newEducation[index], newEducation[index + 1]] =
                          [newEducation[index + 1], newEducation[index]];
                        setEducation(newEducation);
                      }
                    }}>↓</ActionButton>
                    <ActionButton onClick={() => {
                      const newEducation = education.filter((_, i) => i !== index);
                      setEducation(newEducation);
                    }}>×</ActionButton>
                  </ActionButtons>
                </div>
              ))}
              <ActionButton
                style={{ position: 'absolute', right: 0, top: 0 }}
                onClick={() => {
                  setEducation([...education, {
                    school: '',
                    major: '',
                    degree: '',
                    startTime: '',
                    endTime: ''
                  }]);
                  setActiveSection('education');
                }}
              >+</ActionButton>
            </ResumeSection>

            <ResumeSection className="resume-section" color={themeColor}>
              <ResumeSectionTitle color={themeColor} onClick={() => setActiveSection('skills')}>
                专业技能
              </ResumeSectionTitle>
              <div dangerouslySetInnerHTML={{ __html: skills[0] || '' }} />
            </ResumeSection>

            <ResumeSection className="resume-section" color={themeColor}>
              <ResumeSectionTitle color={themeColor} onClick={() => setActiveSection('workExperience')}>
                工作经历
              </ResumeSectionTitle>
              {workExperience.map((work, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <strong>{work.company} - {work.position}</strong>
                    <span>{work.startTime} - {work.endTime}</span>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: work.description }}
                    style={{ lineHeight: '1.2' }}
                  />
                  <ActionButtons>
                    <ActionButton onClick={() => {
                      const newWorkExperience = [...workExperience];
                      if (index > 0) {
                        [newWorkExperience[index], newWorkExperience[index - 1]] =
                          [newWorkExperience[index - 1], newWorkExperience[index]];
                        setWorkExperience(newWorkExperience);
                      }
                    }}>↑</ActionButton>
                    <ActionButton onClick={() => {
                      const newWorkExperience = [...workExperience];
                      if (index < workExperience.length - 1) {
                        [newWorkExperience[index], newWorkExperience[index + 1]] =
                          [newWorkExperience[index + 1], newWorkExperience[index]];
                        setWorkExperience(newWorkExperience);
                      }
                    }}>↓</ActionButton>
                    <ActionButton onClick={() => {
                      const newWorkExperience = workExperience.filter((_, i) => i !== index);
                      setWorkExperience(newWorkExperience);
                    }}>×</ActionButton>
                  </ActionButtons>
                </div>
              ))}
              <ActionButton
                style={{ position: 'absolute', right: 0, top: 0 }}
                onClick={() => {
                  setWorkExperience([...workExperience, {
                    company: '',
                    position: '',
                    startTime: '',
                    endTime: '',
                    description: ''
                  }]);
                  setActiveSection('workExperience');
                }}
              >+</ActionButton>
            </ResumeSection>

            <ResumeSection className="resume-section" color={themeColor}>
              <ResumeSectionTitle color={themeColor} onClick={() => setActiveSection('projects')}>
                项目经验
              </ResumeSectionTitle>
              {projects.map((project, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{project.name}</strong>
                    <span>{project.startTime} - {project.endTime}</span>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: project.description }}
                    style={{ lineHeight: '1.2' }}
                  />
                  <ActionButtons>
                    <ActionButton onClick={() => {
                      const newProjects = [...projects];
                      if (index > 0) {
                        [newProjects[index], newProjects[index - 1]] =
                          [newProjects[index - 1], newProjects[index]];
                        setProjects(newProjects);
                      }
                    }}>↑</ActionButton>
                    <ActionButton onClick={() => {
                      const newProjects = [...projects];
                      if (index < projects.length - 1) {
                        [newProjects[index], newProjects[index + 1]] =
                          [newProjects[index + 1], newProjects[index]];
                        setProjects(newProjects);
                      }
                    }}>↓</ActionButton>
                    <ActionButton onClick={() => {
                      const newProjects = projects.filter((_, i) => i !== index);
                      setProjects(newProjects);
                    }}>×</ActionButton>
                  </ActionButtons>
                </div>
              ))}
              <ActionButton
                style={{ position: 'absolute', right: 0, top: 0 }}
                onClick={() => {
                  setProjects([...projects, {
                    name: '',
                    startTime: '',
                    endTime: '',
                    description: ''
                  }]);
                  setActiveSection('projects');
                }}
              >+</ActionButton>
            </ResumeSection>

            <ResumeSection className="resume-section" color={themeColor}>
              <ResumeSectionTitle color={themeColor} onClick={() => setActiveSection('summary')}>
                个人总结
              </ResumeSectionTitle>
              <div dangerouslySetInnerHTML={{ __html: summary[0] || '' }} />
            </ResumeSection>

          </ResumeContent>
        </PreviewContainer>
      </Container>
    </ConfigProvider>
  );
};

export default Resume;