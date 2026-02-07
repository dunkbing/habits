export default {
  common: {
    settings: 'Cài đặt',
    home: 'Trang chủ',
    explore: 'Khám phá',
    cancel: 'Hủy',
    save: 'Lưu',
    ok: 'OK',
  },
  home: {
    welcome: 'Xin chào!',
    step1Title: 'Bước 1: Thử ngay',
    step1Description:
      'Chỉnh sửa <bold>app/(tabs)/index.tsx</bold> để xem thay đổi. Nhấn <bold>{{devTools}}</bold> để mở công cụ phát triển.',
    step2Title: 'Bước 2: Khám phá',
    step2Description: 'Nhấn vào tab Khám phá để tìm hiểu thêm về ứng dụng mẫu này.',
    step3Title: 'Bước 3: Bắt đầu mới',
    step3Description:
      'Khi bạn đã sẵn sàng, chạy <bold>npm run reset-project</bold> để tạo thư mục <bold>app</bold> mới. Thao tác này sẽ chuyển thư mục <bold>app</bold> hiện tại sang <bold>app-example</bold>.',
  },
  settings: {
    title: 'Cài đặt',
    appearance: 'Giao diện',
    theme: 'Chủ đề',
    themeSystem: 'Hệ thống',
    themeLight: 'Sáng',
    themeDark: 'Tối',
    language: 'Ngôn ngữ',
    languageEn: 'English',
    languageVi: 'Tiếng Việt',
  },
} as const;
