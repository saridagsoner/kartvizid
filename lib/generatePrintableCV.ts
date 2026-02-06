import { CV } from '../types';

export const generatePrintableCV = (cv: CV): string => {
    return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <title>${cv.name} - CV</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Quicksand:wght@700&display=swap');
            body { 
                font-family: 'Inter', sans-serif; 
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important;
                background: #525659;
            }
            @page {
                size: A4;
                margin: 0;
            }
            .a4-page {
                width: 210mm;
                min-height: 297mm;
                background: white;
                margin: 0 auto;
                box-sizing: border-box;
                position: relative;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            @media print {
                body { background: white; }
                .a4-page {
                    width: 210mm;
                    height: auto;
                    min-height: 297mm;
                    box-shadow: none;
                    margin: 0;
                    page-break-after: always;
                }
                .no-print { display: none; }
                
                /* Ensure background colors print */
                * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
        </style>
    </head>
    <body class="bg-gray-100 flex items-center justify-center py-10 print:py-0">

        <!-- Print Controls -->
        <div class="fixed top-5 right-5 flex gap-4 no-print z-50">
            <button onclick="window.print()" class="bg-[#1f6d78] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-[#155e68] transition-transform hover:scale-105 active:scale-95 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                Yazdır / PDF İndir
            </button>
        </div>

        <div class="a4-page flex flex-col">
            
            <!-- Compact Header with Brand Color -->
            <div class="bg-[#1f6d78] text-white px-10 py-8 flex items-center gap-6 shrink-0 print:px-8 print:py-6">
                ${cv.photoUrl ? `
                <div class="w-24 h-24 shrink-0 rounded-full border-[3px] border-white/30 shadow-sm overflow-hidden bg-white">
                    <img src="${cv.photoUrl}" class="w-full h-full object-cover">
                </div>
                ` : ''}
                
                <div class="flex-1 min-w-0">
                    <h1 class="text-3xl font-black uppercase tracking-tight leading-none mb-1.5">${cv.name}</h1>
                    ${cv.profession ? `<p class="text-white/90 text-sm font-medium uppercase tracking-wide">${cv.profession}</p>` : ''}
                </div>

                <!-- Quick Contact (Right Side of Header - Optional style) -->
                <div class="text-right text-xs text-white/80 font-medium space-y-0.5 hidden sm:block">
                     ${cv.city ? `<div>${cv.city}</div>` : ''}
                     ${cv.email ? `<div>${cv.email}</div>` : ''}
                     ${cv.phone ? `<div>${cv.phone}</div>` : ''}
                </div>
            </div>

            <!-- Content Layout -->
            <div class="flex flex-1 items-stretch">
                
                <!-- LEFT SIDEBAR -->
                <div class="w-[32%] bg-[#f8fafc] min-h-[calc(297mm-140px)] p-8 pt-10 border-r border-gray-100 flex flex-col gap-8 print:bg-slate-50">
                    
                    <!-- Contact (If screen is small or repeated preference) -->
                    <div class="space-y-4">
                        ${cv.email || cv.phone || cv.city ? `
                            <div>
                                <h3 class="text-xs font-black text-[#1f6d78] uppercase tracking-widest mb-3 border-b border-[#1f6d78]/20 pb-1">İletişim</h3>
                                <div class="space-y-2.5 text-xs text-gray-600 font-medium">
                                    ${cv.email ? `
                                    <div class="flex flex-col">
                                        <span class="text-[10px] text-gray-400 uppercase font-bold">E-posta</span>
                                        <span class="break-all text-gray-800">${cv.email}</span>
                                    </div>` : ''}
                                    ${cv.phone ? `
                                    <div class="flex flex-col">
                                        <span class="text-[10px] text-gray-400 uppercase font-bold">Telefon</span>
                                        <span class="text-gray-800">${cv.phone}</span>
                                    </div>` : ''}
                                    ${cv.city ? `
                                    <div class="flex flex-col">
                                        <span class="text-[10px] text-gray-400 uppercase font-bold">Konum</span>
                                        <span class="text-gray-800">${cv.city}${cv.district ? ' / ' + cv.district : ''}</span>
                                    </div>` : ''}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Skills -->
                    ${cv.skills && cv.skills.length > 0 ? `
                    <div>
                        <h3 class="text-xs font-black text-[#1f6d78] uppercase tracking-widest mb-3 border-b border-[#1f6d78]/20 pb-1">Yetenekler</h3>
                        <div class="flex flex-wrap gap-1.5">
                            ${cv.skills.map(s => `
                                <span class="bg-white border border-gray-200 text-gray-700 text-[10px] px-2 py-1 rounded-md font-semibold shadow-sm">${s}</span>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Languages -->
                    ${(cv.languageDetails && cv.languageDetails.length > 0) || (cv.language && cv.languageLevel) ? `
                    <div>
                        <h3 class="text-xs font-black text-[#1f6d78] uppercase tracking-widest mb-3 border-b border-[#1f6d78]/20 pb-1">Diller</h3>
                        <div class="space-y-2">
                            ${cv.languageDetails && cv.languageDetails.length > 0 ?
                cv.languageDetails.map(l => `
                                <div class="flex justify-between items-center text-xs">
                                    <span class="font-bold text-gray-600">${l.language}</span>
                                    <span class="text-[10px] text-gray-600 font-medium px-1.5 py-0.5 rounded">${l.level}</span>
                                </div>
                                `).join('')
                : `
                                <div class="flex justify-between items-center text-xs">
                                    <span class="font-bold text-gray-600">${cv.language}</span>
                                    <span class="text-[10px] text-gray-600 font-medium px-1.5 py-0.5 rounded">${cv.languageLevel}</span>
                                </div>
                            `}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Personal Info Details (Military, Driver License etc) -->
                     <div>
                        <h3 class="text-xs font-black text-[#1f6d78] uppercase tracking-widest mb-3 border-b border-[#1f6d78]/20 pb-1">Kişisel</h3>
                        <div class="space-y-1.5 text-xs">
                            ${cv.experienceYears ? `
                             <div class="flex justify-between"><span class="text-gray-400">Tecrübe</span> <span class="font-bold text-gray-800">${cv.experienceYears} Yıl</span></div>
                            ` : ''}
                            ${cv.militaryStatus && cv.militaryStatus !== 'Belirtilmedi' ? `
                             <div class="flex justify-between"><span class="text-gray-400">Askerlik</span> <span class="font-bold text-gray-800">${cv.militaryStatus}</span></div>
                            ` : ''}
                            ${cv.driverLicense && cv.driverLicense.length > 0 ? `
                             <div class="flex justify-between"><span class="text-gray-400">Ehliyet</span> <span class="font-bold text-gray-800">${cv.driverLicense.join(', ')}</span></div>
                            ` : ''}
                             ${cv.disabilityStatus && cv.disabilityStatus !== 'Yok' && cv.disabilityStatus !== 'Belirtilmedi' ? `
                             <div class="flex justify-between"><span class="text-gray-400">Engel</span> <span class="font-bold text-gray-800">${cv.disabilityStatus}</span></div>
                            ` : ''}
                        </div>
                    </div>

                </div>

                <!-- RIGHT MAIN CONTENT -->
                <div class="flex-1 p-8 pt-10 flex flex-col gap-8">
                    
                    <!-- About -->
                    ${cv.about ? `
                    <div class="mb-2">
                        <h3 class="text-sm font-black text-black uppercase tracking-widest mb-3 border-b-2 border-gray-100 pb-1.5">Hakkında</h3>
                        <p class="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                            ${cv.about}
                        </p>
                    </div>
                    ` : ''}

                    <!-- Work Experience -->
                    ${cv.workExperience && cv.workExperience.length > 0 ? `
                    <div>
                        <h3 class="text-sm font-black text-black uppercase tracking-widest mb-5 border-b-2 border-gray-100 pb-1.5">İş Deneyimi</h3>
                        <div class="space-y-6">
                            ${cv.workExperience.map(job => `
                            <div class="relative pl-4 border-l-2 border-gray-100">
                                <div class="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#1f6d78] border border-white"></div>
                                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                    <h4 class="font-bold text-gray-900 text-sm uppercased">${job.role}</h4>
                                    <span class="text-[11px] font-bold text-[#1f6d78] whitespace-nowrap ml-auto sm:ml-4">
                                        ${job.startDate} - ${job.isCurrent ? 'Devam Ediyor' : job.endDate}
                                    </span>
                                </div>
                                <div class="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">${job.company}</div>
                                ${job.description ? `<p class="text-xs text-gray-600 leading-relaxed whitespace-pre-line">${job.description}</p>` : ''}
                            </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Internships (If any) -->
                    ${cv.internshipDetails && cv.internshipDetails.length > 0 ? `
                    <div>
                        <h3 class="text-sm font-black text-black uppercase tracking-widest mb-5 border-b-2 border-gray-100 pb-1.5">Staj Deneyimi</h3>
                        <div class="space-y-6">
                            ${cv.internshipDetails.map(intern => `
                            <div class="relative pl-4 border-l-2 border-gray-100">
                                <div class="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 border border-white"></div>
                                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                    <h4 class="font-bold text-gray-900 text-sm">${intern.role}</h4>
                                    <span class="text-[11px] font-medium text-gray-500 whitespace-nowrap">
                                        ${intern.startDate} - ${intern.isCurrent ? 'Devam Ediyor' : intern.endDate}
                                    </span>
                                </div>
                                <div class="text-xs font-bold text-gray-500 mb-2 uppercase">${intern.company}</div>
                                ${intern.description ? `<p class="text-xs text-gray-600 leading-relaxed whitespace-pre-line">${intern.description}</p>` : ''}
                            </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Education -->
                    <div>
                        <h3 class="text-sm font-black text-black uppercase tracking-widest mb-5 border-b-2 border-gray-100 pb-1.5">Eğitim</h3>
                        <div class="space-y-5">
                            ${cv.educationDetails && cv.educationDetails.length > 0 ?
            cv.educationDetails.map(edu => `
                                <div>
                                    <div class="flex justify-between items-baseline mb-0.5">
                                        <h4 class="font-bold text-gray-900 text-sm">${edu.university}</h4>
                                        <span class="text-[11px] text-gray-400 font-medium whitespace-nowrap">${edu.startDate || ''} - ${edu.endDate || 'Mezun'}</span>
                                    </div>
                                    <div class="flex items-center gap-2 text-xs text-gray-600">
                                        <span class="font-medium text-[#1f6d78]">${edu.department || ''}</span>
                                        ${edu.level ? `<span class="w-1 h-1 rounded-full bg-gray-300"></span> <span>${edu.level}</span>` : ''}
                                    </div>
                                </div>
                                `).join('')
            : `
                                <div>
                                    <h4 class="font-bold text-gray-900 text-sm">${cv.education}</h4>
                                    <div class="text-xs text-gray-600 italic mt-1">
                                        ${cv.educationLevel || 'Lisans'} | ${cv.graduationStatus || 'Mezun'}
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>

                    <!-- Work Preferences (Compact) -->
                     ${cv.preferredRoles && cv.preferredRoles.length > 0 ? `
                     <div class="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                         <h3 class="text-xs font-black text-black uppercase tracking-widest mb-3">İş Tercihleri</h3>
                         <div class="flex flex-wrap gap-4 text-xs">
                             <div><span class="text-gray-400 uppercase font-bold text-[9px] block">Şehir</span> <span class="font-semibold text-gray-800">${cv.preferredCity || 'Belirtilmedi'}</span></div>
                             <div><span class="text-gray-400 uppercase font-bold text-[9px] block">Pozisyonlar</span> <span class="font-semibold text-gray-800">${cv.preferredRoles.join(', ')}</span></div>
                             <div><span class="text-gray-400 uppercase font-bold text-[9px] block">Çalışma Şekli</span> <span class="font-semibold text-gray-800">${cv.workType || '-'}</span></div>
                         </div>
                     </div>
                     ` : ''}

                     <!-- References -->
                    ${cv.references && cv.references.length > 0 ? `
                    <div>
                        <h3 class="text-sm font-black text-black uppercase tracking-widest mb-4 border-b-2 border-gray-100 pb-1.5">Referanslar</h3>
                        <div class="grid grid-cols-2 gap-4">
                           ${cv.references.map(ref => `
                               <div class="px-1 py-2">
                                   <p class="font-bold text-xs text-black">${ref.name}</p>
                                   <p class="text-[10px] text-[#1f6d78] font-bold mb-1">${ref.company} - ${ref.role}</p>
                                   ${ref.phone ? `<p class="text-[10px] text-gray-500">Tel: ${ref.phone}</p>` : ''}
                                   ${ref.email ? `<p class="text-[10px] text-gray-500 truncate">Mail: ${ref.email}</p>` : ''}
                               </div>
                           `).join('')}
                        </div>
                    </div>
                    ` : ''}

                </div>
            </div>

            <!-- Minimal Footer -->
            <!-- Minimal Footer -->
            <div class="w-full text-right py-4 px-10 mt-auto bg-white border-t border-gray-100 print:border-none flex justify-end items-center gap-2">
                <div class="flex items-center text-gray-900 text-lg font-bold tracking-tight leading-none" style="font-family: 'Quicksand', sans-serif;">
                    <span>Kartvizi</span>
                    <span class="inline-block transform rotate-[12deg] origin-center text-[#1f6d78] font-black">d</span>
                </div>
                <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider relative top-[1px]">.com ile oluşturuldu</span>
            </div>

        </div>
    </body>
    </html>
  `;
};
