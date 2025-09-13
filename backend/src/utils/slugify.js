function toSlug(str = '') {
  return String(str)
    .normalize('NFD')                    // Phân tách dấu
    .replace(/[\u0300-\u036f]/g, '')     // Bỏ dấu tiếng Việt
    .replace(/đ/g, 'd').replace(/Đ/g, 'D') // Xử lý 'đ' và 'Đ'
    .toLowerCase()                       // Chuyển tất cả thành chữ thường
    .trim()                              // Bỏ khoảng trắng đầu/cuối
    .replace(/[^a-z0-9\s-]/g, '')        // Bỏ ký tự lạ
    .replace(/\s+/g, '-')                // Thay thế khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, '-');                // Loại bỏ dấu gạch ngang liên tiếp
}

module.exports = { toSlug };
