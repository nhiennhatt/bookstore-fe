export function Footer() {
  return (
    <footer className="bg-white border-t border-border pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold tracking-tighter mb-4 text-deep-charcoal">Lumina</h3>
            <p className="text-cool-slate leading-relaxed mb-6">
              Tuyển tập những tác phẩm văn học chọn lọc dành cho độc giả hiện đại. Khám phá, trải nghiệm và tìm thấy đam mê tiếp theo của bạn.
            </p>
            <div className="flex gap-4">
              {/* Social icons could go here */}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6 text-deep-charcoal">Cửa hàng</h4>
            <ul className="space-y-4 text-sm font-medium text-cool-slate">
              <li><a href="#" className="hover:text-electric-indigo transition-colors">Tiểu thuyết</a></li>
              <li><a href="#" className="hover:text-electric-indigo transition-colors">Phi hư cấu</a></li>
              <li><a href="#" className="hover:text-electric-indigo transition-colors">Sách thiếu nhi</a></li>
              <li><a href="#" className="hover:text-electric-indigo transition-colors">Ấn bản đặc biệt</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6 text-deep-charcoal">Hỗ trợ</h4>
            <ul className="space-y-4 text-sm font-medium text-cool-slate">
              <li><a href="#" className="hover:text-electric-indigo transition-colors">Giao hàng</a></li>
              <li><a href="#" className="hover:text-electric-indigo transition-colors">Đổi trả</a></li>
              <li><a href="#" className="hover:text-electric-indigo transition-colors">Liên hệ</a></li>
              <li><a href="#" className="hover:text-electric-indigo transition-colors">Hỏi đáp</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6 text-deep-charcoal">Về chúng tôi</h4>
            <ul className="space-y-4 text-sm font-medium text-cool-slate">
              <li><a href="#" className="hover:text-electric-indigo transition-colors">Câu chuyện</a></li>
              <li><a href="#" className="hover:text-electric-indigo transition-colors">Phát triển bền vững</a></li>
              <li><a href="#" className="hover:text-electric-indigo transition-colors">Tạp chí</a></li>
              <li><a href="#" className="hover:text-electric-indigo transition-colors">Tuyển dụng</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-medium text-cool-slate">
            © 2024 Lumina Books. Tuyển chọn với tinh thần khác biệt.
          </p>
          <div className="flex gap-6 text-xs font-medium text-cool-slate">
            <a href="#" className="hover:text-electric-indigo transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-electric-indigo transition-colors">Điều khoản dịch vụ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
