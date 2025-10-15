<template>
  <AppLayout>
    <ContentLayout 
      title="เกี่ยวกับเรา"
      description="คำสอนหลวงพ่อธัมมชโย (คุณครูไม่ใหญ่) - ธรรมะที่เข้าใจง่าย ลึกซึ้ง และทรงคุณค่า"
    >
      <n-space vertical :size="24">
        <!-- Logo Section -->
        <n-card class="logo-card">
          <div class="logo-container">
            <n-image
              :src="logo2"
              alt="Dhamma01 Logo"
              :width="200"
              :height="200"
              object-fit="contain"
              preview-disabled
            />
          </div>
        </n-card>

        <!-- Main Content Card -->
        <n-card class="content-card">
          <template #header>
            <h2 class="section-title">คำสอนคุณครูไม่ใหญ่</h2>
          </template>
          
          <n-space vertical :size="16">
            <p class="content-text">
              คำสอนของหลวงพ่อธัมมชโย (คุณครูไม่ใหญ่) เป็นธรรมะที่ง่ายแต่ลึกซึ้งและทรงคุณค่า เป็นสิ่งที่ท่านศึกษามาจากคำสอนของพระสัมมาสัมพุทธเจ้าและจากผลของธรรมปฏิบัติ ท่านได้เมตตากลั่นกรองถ่ายทอดออกมาด้วยถ้อยคำที่เข้าใจได้ง่าย ชัดเจน แจ่มแจ้ง และเปี่ยมไปด้วยข้อคิดที่เกิดกำลังใจในการปฏิบัติตาม ทั้งยังช่วยตอกย้ำสัมมาทิฐิให้มั่นคงยิ่งขึ้น หากใครได้นำคำสอนเหล่านี้ไปใช้ในการดำเนินชีวิตก็จะเกิดประโยชน์อย่างยิ่งแก่ตนเองทั้งในโลกนี้และโลกหน้าอย่างแน่นอน
            </p>
            
            <p class="content-text">
              อาสาสมัครเพื่อเผยแพร่ธรรมะ จึงได้รวบรวมหนังสือทุกเล่มและโอวาทของท่านในวาระต่างๆ มาเรียบเรียงแล้วจัดทำในรูปแบบของเว็บไซต์ เพื่อสะดวกและง่ายต่อการค้นหาธรรมะในหัวข้อที่ต้องการ ทั้งนี้ในส่วนของหนังสือยังคงรูปแบบของหน้าหนังสือไว้ และยังสามารถดาวโหลดไฟล์หนังสือเก็บไว้อ่านได้อีกด้วย
            </p>
            
            <p class="content-text">
              หวังเป็นอย่างยิ่งว่า เว็บไซต์นี้จะตอบโจทย์ในการค้นหาโอวาทหลวงพ่อธัมมชโย เพื่อนำไปใช้งานสำหรับท่านที่สนใจ
            </p>
          </n-space>
        </n-card>
      </n-space>
    </ContentLayout>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layouts/AppLayout.vue'
import ContentLayout from '@/components/layouts/ContentLayout.vue'
import logo2 from '@/assets/logo2.png'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600&display=swap');

.logo-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}

.content-card {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-family: 'Sarabun', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin: 0;
}

.content-text {
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  text-align: justify;
  text-indent: 50px;
  margin: 0;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .section-title {
    font-size: 20px;
  }
  
  .content-text {
    font-size: 14px;
    text-indent: 30px;
  }
  
  .logo-container {
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 18px;
  }
  
  .content-text {
    font-size: 13px;
    text-indent: 20px;
  }
}
</style>