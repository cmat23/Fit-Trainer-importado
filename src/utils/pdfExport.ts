import jsPDF from 'jspdf';
import { Client, ProgressEntry, Workout } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function generateClientReport(
  client: Client,
  progressEntries: ProgressEntry[],
  workouts: Workout[]
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = margin;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text('FitTrainer Pro', margin, yPosition);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  yPosition += 10;
  doc.text('Reporte de Progreso del Cliente', margin, yPosition);
  
  yPosition += 20;

  // Client Info
  doc.setFontSize(14);
  doc.setTextColor(75, 85, 99); // Gray color
  doc.text('INFORMACIÓN DEL CLIENTE', margin, yPosition);
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Nombre: ${client.name}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Email: ${client.email}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Edad: ${client.age} años`, margin, yPosition);
  yPosition += 7;
  doc.text(`Altura: ${client.height} cm`, margin, yPosition);
  yPosition += 7;
  doc.text(`Peso actual: ${client.currentWeight} kg`, margin, yPosition);
  
  yPosition += 15;

  // Goals
  doc.setFontSize(14);
  doc.setTextColor(75, 85, 99);
  doc.text('OBJETIVOS', margin, yPosition);
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  client.goals.forEach((goal, index) => {
    doc.text(`• ${goal}`, margin + 5, yPosition);
    yPosition += 7;
  });

  yPosition += 15;

  // Progress Summary
  if (progressEntries.length > 0) {
    const latestProgress = progressEntries[progressEntries.length - 1];
    const firstProgress = progressEntries[0];
    
    doc.setFontSize(14);
    doc.setTextColor(75, 85, 99);
    doc.text('RESUMEN DE PROGRESO', margin, yPosition);
    
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    const weightChange = latestProgress.weight - firstProgress.weight;
    doc.text(`Cambio de peso: ${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg`, margin, yPosition);
    yPosition += 7;
    
    if (latestProgress.bodyFat && firstProgress.bodyFat) {
      const bodyFatChange = latestProgress.bodyFat - firstProgress.bodyFat;
      doc.text(`Cambio % grasa: ${bodyFatChange > 0 ? '+' : ''}${bodyFatChange.toFixed(1)}%`, margin, yPosition);
      yPosition += 7;
    }
    
    if (latestProgress.muscleMass && firstProgress.muscleMass) {
      const muscleChange = latestProgress.muscleMass - firstProgress.muscleMass;
      doc.text(`Cambio masa muscular: ${muscleChange > 0 ? '+' : ''}${muscleChange.toFixed(1)} kg`, margin, yPosition);
      yPosition += 7;
    }
    
    yPosition += 15;
  }

  // Workout Summary
  const completedWorkouts = workouts.filter(w => w.completed);
  doc.setFontSize(14);
  doc.setTextColor(75, 85, 99);
  doc.text('ENTRENAMIENTOS', margin, yPosition);
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total de entrenamientos: ${workouts.length}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Entrenamientos completados: ${completedWorkouts.length}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Tasa de cumplimiento: ${workouts.length > 0 ? Math.round((completedWorkouts.length / workouts.length) * 100) : 0}%`, margin, yPosition);

  // Add new page if needed
  if (yPosition > 250) {
    doc.addPage();
    yPosition = margin;
  }

  yPosition += 20;

  // Progress Table
  if (progressEntries.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(75, 85, 99);
    doc.text('HISTORIAL DE MEDICIONES', margin, yPosition);
    
    yPosition += 15;
    
    // Table headers
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const headers = ['Fecha', 'Peso (kg)', '% Grasa', 'Masa Muscular (kg)', 'IMC'];
    const colWidths = [35, 25, 25, 35, 20];
    let xPosition = margin;
    
    headers.forEach((header, index) => {
      doc.text(header, xPosition, yPosition);
      xPosition += colWidths[index];
    });
    
    yPosition += 10;
    
    // Table data
    progressEntries.slice(-10).forEach((entry) => {
      xPosition = margin;
      const rowData = [
        format(entry.date, 'dd/MM/yyyy', { locale: es }),
        entry.weight.toString(),
        entry.bodyFat?.toString() || 'N/A',
        entry.muscleMass?.toString() || 'N/A',
        entry.bmi?.toFixed(1) || 'N/A'
      ];
      
      rowData.forEach((data, index) => {
        doc.text(data, xPosition, yPosition);
        xPosition += colWidths[index];
      });
      
      yPosition += 7;
      
      if (yPosition > 270) {
        doc.addPage();
        yPosition = margin;
      }
    });
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })} - Página ${i} de ${pageCount}`,
      margin,
      doc.internal.pageSize.height - 10
    );
  }

  // Save the PDF
  doc.save(`reporte-${client.name.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}