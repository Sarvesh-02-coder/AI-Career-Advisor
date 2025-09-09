import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function useExportKit() {
  const exportToPDF = async (userProfile: any, dashboardRef: React.RefObject<HTMLElement>) => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Add header
      pdf.setFontSize(24);
      pdf.setTextColor(98, 52, 183); // Primary color
      pdf.text('AI Career Advisor - Career Kit', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Generated for: ${userProfile.name}`, pageWidth / 2, 30, { align: 'center' });
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 35, { align: 'center' });
      
      // Profile Summary
      let yPosition = 50;
      pdf.setFontSize(16);
      pdf.setTextColor(98, 52, 183);
      pdf.text('Profile Summary', 20, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Education: ${userProfile.educationLevel}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Graduation Year: ${userProfile.graduationYear}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Work Preference: ${userProfile.workPreference}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Career Timeline: ${userProfile.timeframe}`, 20, yPosition);
      
      // Skills Section
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.setTextColor(98, 52, 183);
      pdf.text('Technical Skills', 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      const techSkillsText = userProfile.technicalSkills.join(', ');
      const splitTechSkills = pdf.splitTextToSize(techSkillsText, pageWidth - 40);
      pdf.text(splitTechSkills, 20, yPosition);
      yPosition += splitTechSkills.length * 5;
      
      yPosition += 10;
      pdf.setFontSize(16);
      pdf.setTextColor(98, 52, 183);
      pdf.text('Soft Skills', 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      const softSkillsText = userProfile.softSkills.join(', ');
      const splitSoftSkills = pdf.splitTextToSize(softSkillsText, pageWidth - 40);
      pdf.text(splitSoftSkills, 20, yPosition);
      yPosition += splitSoftSkills.length * 5;
      
      // Career Recommendations
      yPosition += 15;
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(16);
      pdf.setTextColor(98, 52, 183);
      pdf.text('Top Career Recommendations', 20, yPosition);
      
      // Add recommended careers (hardcoded for demo)
      const careers = [
        { title: 'Frontend Developer', match: '92%', salary: '$75,000 - $120,000' },
        { title: 'Full Stack Developer', match: '85%', salary: '$80,000 - $130,000' },
        { title: 'Product Manager', match: '78%', salary: '$90,000 - $150,000' }
      ];
      
      careers.forEach((career, index) => {
        yPosition += 10;
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${index + 1}. ${career.title}`, 25, yPosition);
        yPosition += 5;
        pdf.setFontSize(10);
        pdf.text(`Match: ${career.match} | Salary: ${career.salary}`, 30, yPosition);
      });
      
      // 6-Week Roadmap
      yPosition += 20;
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(16);
      pdf.setTextColor(98, 52, 183);
      pdf.text('6-Week Learning Roadmap', 20, yPosition);
      
      const roadmap = [
        'Week 1: Advanced React Patterns (5 hours)',
        'Week 2: Build a Portfolio Project (10 hours)',
        'Week 3: System Design Basics (8 hours)',
        'Week 4: Resume Optimization (3 hours)',
        'Week 5: Mock Interviews (4 hours)',
        'Week 6: Network & Apply (6 hours)'
      ];
      
      roadmap.forEach((item, index) => {
        yPosition += 8;
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`• ${item}`, 25, yPosition);
      });
      
      // Links section
      yPosition += 20;
      pdf.setFontSize(16);
      pdf.setTextColor(98, 52, 183);
      pdf.text('Your Links', 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      
      if (userProfile.github) {
        pdf.text(`GitHub: ${userProfile.github}`, 25, yPosition);
        yPosition += 5;
      }
      if (userProfile.linkedin) {
        pdf.text(`LinkedIn: ${userProfile.linkedin}`, 25, yPosition);
        yPosition += 5;
      }
      if (userProfile.portfolio) {
        pdf.text(`Portfolio: ${userProfile.portfolio}`, 25, yPosition);
      }
      
      // Save the PDF
      pdf.save(`${userProfile.name}-Career-Kit.pdf`);
      
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return false;
    }
  };

  const exportToMarkdown = (userProfile: any) => {
    const markdown = `# AI Career Advisor - Career Kit

**Generated for:** ${userProfile.name}  
**Date:** ${new Date().toLocaleDateString()}  
**Email:** ${userProfile.email}

## Profile Summary

- **Education Level:** ${userProfile.educationLevel}
- **Graduation Year:** ${userProfile.graduationYear}
- **Work Preference:** ${userProfile.workPreference}
- **Career Timeline:** ${userProfile.timeframe}

## Skills Assessment

### Technical Skills
${userProfile.technicalSkills.map((skill: string) => `- ${skill}`).join('\n')}

### Soft Skills
${userProfile.softSkills.map((skill: string) => `- ${skill}`).join('\n')}

### Areas of Interest
${userProfile.interests.map((interest: string) => `- ${interest}`).join('\n')}

## Career Recommendations

### 1. Frontend Developer (92% Match)
- **Salary Range:** $75,000 - $120,000
- **Growth Rate:** +15%
- **Description:** Build user interfaces and experiences for web applications

### 2. Full Stack Developer (85% Match)
- **Salary Range:** $80,000 - $130,000
- **Growth Rate:** +13%
- **Description:** Work on both frontend and backend development

### 3. Product Manager (78% Match)
- **Salary Range:** $90,000 - $150,000
- **Growth Rate:** +11%
- **Description:** Lead product development and strategy

## 6-Week Learning Roadmap

1. **Week 1:** Advanced React Patterns (5 hours)
2. **Week 2:** Build a Portfolio Project (10 hours)
3. **Week 3:** System Design Basics (8 hours)
4. **Week 4:** Resume Optimization (3 hours)
5. **Week 5:** Mock Interviews (4 hours)
6. **Week 6:** Network & Apply (6 hours)

## Quick Action Items

- [ ] Complete LinkedIn profile optimization
- [ ] Create/update GitHub portfolio
- [ ] Build 2-3 showcase projects
- [ ] Practice technical interviews
- [ ] Network with industry professionals
- [ ] Apply to target companies

## Your Links

${userProfile.github ? `- **GitHub:** ${userProfile.github}` : ''}
${userProfile.linkedin ? `- **LinkedIn:** ${userProfile.linkedin}` : ''}
${userProfile.portfolio ? `- **Portfolio:** ${userProfile.portfolio}` : ''}

---

*Generated by AI Career Advisor*
`;

    // Create and download markdown file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${userProfile.name}-Career-Kit.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  };

  return { exportToPDF, exportToMarkdown };
}