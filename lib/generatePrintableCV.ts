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
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body { 
                font-family: 'Inter', sans-serif; 
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important;
                background: #525659;
                color: #000;
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
                padding: 12mm 15mm;
                box-sizing: border-box;
                position: relative;
                display: flex;
                flex-direction: column;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            @media print {
                body { background: white; }
                .a4-page {
                    width: 210mm;
                    height: 297mm;
                    box-shadow: none;
                    margin: 0;
                    padding: 12mm 15mm;
                    page-break-after: always;
                }
                .no-print { display: none; }
            }
            /* Clean typography utilities */
            h1 { letter-spacing: -0.02em; }
            h2 { letter-spacing: 0.05em; }
        </style>
    </head>
    <body class="bg-gray-100 flex items-center justify-center py-10 print:py-0">

        <!-- Print Controls -->
        <div class="fixed top-5 right-5 flex gap-4 no-print">
            <button onclick="window.print()" class="bg-[#1f6d78] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-[#155e68] transition-transform hover:scale-105 active:scale-95 flex items-center gap-2">
                Yazdır / PDF İndir
            </button>
        </div>

        <div class="a4-page">
            
            <!-- Header Section with Photo -->
            <div class="flex gap-8 mb-12 border-b border-gray-200 pb-8">
                <!-- Photo: Vertical Rectangle / Ovalish like business card -->
                <div class="w-[140px] h-[190px] shrink-0">
                    <img src="${cv.photoUrl || 'https://picsum.photos/seed/user-placeholder/300/400'}" class="w-full h-full object-cover rounded-[1.5rem] shadow-sm">
                </div>
                
                <!-- Helper Info -->
                <div class="flex-1 flex flex-col justify-center">
                    <h1 class="text-4xl font-black text-black mb-2 uppercase tracking-tight">${cv.name}</h1>
                    <p class="text-xl font-medium text-gray-600 uppercase tracking-wide mb-6">${cv.profession}</p>
                    
                    <div class="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
                        ${cv.email ? `<div><span class="font-bold text-black">E-posta:</span> ${cv.email}</div>` : ''}
                        ${cv.phone ? `<div><span class="font-bold text-black">Telefon:</span> ${cv.phone}</div>` : ''}
                        ${cv.city ? `<div><span class="font-bold text-black">Konum:</span> ${cv.city}</div>` : ''}
                    </div>
                </div>
            </div>

            <!-- Content Grid: 2 Columns (Sidebar styled left, Main Content right) -->
            <div class="flex flex-1 gap-10 items-start">
                
                <!-- Left Column (Compact info) -->
                <div class="w-[30%] shrink-0 flex flex-col gap-8">
                    
                    <!-- About -->
                    <div>
                        <h3 class="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-3">Hakkında</h3>
                        <p class="text-sm text-gray-700 leading-relaxed font-medium italic">
                            "${cv.about || '...'}"
                        </p>
                    </div>

                    <!-- Skills -->
                    <div>
                        <h3 class="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-3">Yetenekler</h3>
                        <div class="flex flex-col gap-1.5">
                            ${cv.skills.map(s => `<span class="text-sm font-medium text-gray-800">• ${s}</span>`).join('')}
                        </div>
                    </div>

                    <!-- Languages -->
                    <div>
                        <h3 class="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-3">Diller</h3>
                        <div class="flex flex-col gap-1">
                            <div class="flex justify-between items-baseline">
                                <span class="text-sm font-bold text-gray-900">${cv.language}</span>
                                <span class="text-xs text-gray-500">${cv.languageLevel}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Personal Info -->
                    <div>
                        <h3 class="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-3">Kişisel Bilgiler</h3>
                        <div class="space-y-2 text-sm">
                             <div class="flex justify-between"><span class="text-gray-500">Tecrübe:</span> <span class="font-bold text-black">${cv.experienceYears} Yıl</span></div>
                             <div class="flex justify-between"><span class="text-gray-500">Eğitim:</span> <span class="font-bold text-black">${cv.educationLevel || 'Lisans'}</span></div>
                             <div class="flex justify-between"><span class="text-gray-500">Askerlik:</span> <span class="font-bold text-black">${cv.militaryStatus || '-'}</span></div>
                             <div class="flex justify-between"><span class="text-gray-500">Ehliyet:</span> <span class="font-bold text-black">${cv.driverLicense?.join(', ') || '-'}</span></div>
                        </div>
                    </div>
                </div>

                <!-- Right Column (Main Details) -->
                <div class="flex-1 flex flex-col gap-8">
                    
                     <!-- Education -->
                    <div>
                        <h3 class="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-4">Eğitim Bilgileri</h3>
                        <div>
                            <h4 class="font-bold text-lg text-black bg-gray-50/0">${cv.education}</h4>
                            <div class="flex gap-4 mt-1 text-sm text-gray-600">
                                 <span>${cv.educationLevel || 'Lisans'}</span>
                                 <span class="text-gray-300">|</span>
                                 <span>${cv.graduationStatus || 'Mezun'}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Work Preferences -->
                    <div>
                        <h3 class="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-4">İş Tercihleri</h3>
                        <div class="grid grid-cols-2 gap-y-4 gap-x-8">
                             <div>
                                <p class="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Çalışma Şekli</p>
                                <p class="text-sm font-bold text-black">${cv.workType || '-'}</p>
                             </div>
                             <div>
                                <p class="text-[10px] uppercase font-bold text-gray-400 mb-0.5">İstihdam Türü</p>
                                <p class="text-sm font-bold text-black">${cv.employmentType || '-'}</p>
                             </div>
                             <div class="col-span-2">
                                <p class="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Maaş Beklentisi</p>
                                <p class="text-sm font-bold text-black">${cv.salaryMin.toLocaleString('tr-TR')}₺ - ${cv.salaryMax.toLocaleString('tr-TR')}₺ <span class="text-gray-400 font-normal ml-1">(Aylık Net)</span></p>
                             </div>
                             <div class="col-span-2 mt-2">
                                <p class="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Tercih Edilen Şehir</p>
                                <p class="text-sm font-bold text-black">${cv.preferredCity || 'Belirtilmedi'}</p>
                             </div>
                             <div class="col-span-2">
                                <p class="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Tercih Edilen Alanlar</p>
                                <p class="text-sm font-bold text-black">${cv.preferredRoles && cv.preferredRoles.length > 0 ? cv.preferredRoles.join(', ') : 'Belirtilmedi'}</p>
                             </div>
                        </div>
                    </div>

                    <!-- References -->
                    ${cv.references && cv.references.length > 0 ? `
                    <div>
                        <h3 class="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-4">Referanslar</h3>
                        <div class="space-y-4">
                           ${cv.references.map(ref => `
                               <div>
                                   <p class="font-bold text-sm text-black">${ref.name}</p>
                                   <p class="text-xs text-gray-600 mb-1">${ref.role} @ ${ref.company}</p>
                                   ${ref.phone ? `<p class="text-xs text-gray-500">Tel: ${ref.phone}</p>` : ''}
                                   ${ref.email ? `<p class="text-xs text-gray-500">E-posta: ${ref.email}</p>` : ''}
                               </div>
                           `).join('')}
                        </div>
                    </div>
                    ` : ''}

                </div>
            </div>

            <!-- Footer Date -->
            <div class="absolute bottom-6 right-8 text-[10px] text-gray-300 font-medium">
                Kartvizid.com ile oluşturuldu
            </div>
        </div>

    </body>
    </html>
  `;
};
