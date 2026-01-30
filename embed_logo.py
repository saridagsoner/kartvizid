
import os

base64_path = "logo_base64.txt"
artifact_path = "/Users/sonersaridag/.gemini/antigravity/brain/68063380-8b45-4fec-86a2-190b2ec76c6e/email_template_confirmation.html"

try:
    with open(base64_path, "r") as f:
        b64_data = f.read().strip()
        # Remove any newlines just in case base64 command included them
        b64_data = b64_data.replace("\n", "").replace("\r", "")

    html_content = f"""<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kartvizid'e Hoş Geldin</title>
  <style>
    body {{ font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; color: #374151; }}
    .container {{ max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden; }}
    .header {{ padding: 40px; text-align: center; border-bottom: 1px solid #f3f4f6; }}
    .content {{ padding: 40px 30px; text-align: center; }}
    h1 {{ color: #1f6d78; font-size: 24px; font-weight: 800; margin-bottom: 20px; letter-spacing: -0.5px; }}
    p {{ font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 30px; }}
    .btn {{ display: inline-block; background-color: #1f6d78; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; }}
    .footer {{ background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img 
        src="data:image/png;base64,{b64_data}" 
        alt="Kartvizid Logo" 
        style="max-height: 50px; width: auto;"
      >
    </div>
    
    <div class="content">
      {{{{ if eq .Data.role "employer" }}}}
        <!-- Employer Content -->
        <h1>Kartvizid İş Dünyasına Hoş Geldiniz! 🏢</h1>
        <p>Merhaba,</p>
        <p>
          En iyi yeteneklere ulaşmak ve firmanızı büyütmek için doğru yerdesiniz. 
          İş veren hesabınızı doğrulayarak hemen ilan vermeye ve adayları incelemeye başlayabilirsiniz.
        </p>
      {{{{ else }}}}
        <!-- Job Seeker Content (Default) -->
        <h1>Kartvizid Dünyasına Hoş Geldiniz! 🚀</h1>
        <p>Merhaba,</p>
        <p>
          Kariyerinizde yeni bir sayfa açmak ve profesyonel ağınızı genişletmek için harika bir adım attınız.
          Dijital CV'nizi oluşturmak ve fırsatları keşfetmek için lütfen hesabınızı doğrulayın.
        </p>
      {{{{ end }}}}

      <a href="{{{{ .ConfirmationURL }}}}" class="btn">Hesabımı Doğrula</a>
      
      <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
        Eğer yukarıdaki buton çalışmazsa, aşağıdaki bağlantıyı tarayıcınıza kopyalayın:<br>
        <a href="{{{{ .ConfirmationURL }}}}" style="color: #1f6d78; word-break: break-all;">{{{{ .ConfirmationURL }}}}</a>
      </p>
    </div>

    <div class="footer">
      <p>© 2026 Kartvizid.com. Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>"""

    with open(artifact_path, "w") as f:
        f.write(html_content)

    print("Template updated successfully")

except Exception as e:
    print(f"Error: {e}")
