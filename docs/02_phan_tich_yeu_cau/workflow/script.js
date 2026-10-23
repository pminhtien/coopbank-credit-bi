// Sync Theme Module
(function(){
  function syncBody(){ var dt=document.documentElement.getAttribute('data-theme'); if(document.body && (dt==='dark'||dt==='light')) document.body.classList.toggle('dark-mode', dt==='dark'); }
  function syncTheme(theme){ if(theme!=='dark'&&theme!=='light')return; document.documentElement.setAttribute('data-theme',theme); syncBody(); }
  if(typeof MutationObserver==='function') new MutationObserver(syncBody).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  document.addEventListener('DOMContentLoaded',syncBody);
  try{ var mq=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)'); if(mq){ var cur=document.documentElement.getAttribute('data-theme'); if(!cur)syncTheme(mq.matches?'dark':'light'); else syncTheme(cur); if(mq.addEventListener)mq.addEventListener('change',function(e){syncTheme(e.matches?'dark':'light');}); } }catch(e){}
  window.addEventListener('message',function(e){ if(e.data&&(e.data.type==='set-theme'||e.data.type==='APPLY_THEME')&&e.data.theme)syncTheme(e.data.theme); });
})();

// State Machine Data
const DATA = {
"A1": {
    stage: "Giai đoạn A", title: "A1: Dựng repo GitHub, Docker Compose PostgreSQL, môi trường Python",
    obj: "Thiết lập nền tảng quản lý mã nguồn, CSDL cục bộ và môi trường lập trình ETL.",
    in: "Ý tưởng dự án, cấu hình máy tính cá nhân.", out: "Repo GitHub init, file docker-compose.yml (Postgres), môi trường venv/Python sẵn sàng.",
    tools: "AI Agent trong VS Code (viết file cấu hình, cài đặt thư viện).",
    criteria: "Git kết nối thành công, lệnh 'docker-compose up' chạy CSDL ổn định, Python chạy được file hello world.",
    risk: "Xung đột port 5432 trên máy cá nhân, lỗi phân quyền thư mục bind mount Docker.",
    prev: null, next: "A2"
},
"A2": {
    stage: "Giai đoạn A", title: "A2: Tạo file context chung và hướng dẫn cho AI agent",
    obj: "Tạo tài liệu mô tả kiến trúc, luồng dữ liệu (context.md) để cung cấp ngữ cảnh nhất quán cho AI Agent trong suốt quá trình code.",
    in: "Repo môi trường (A1).", out: "File context chung (.md, .txt) chứa prompt và guideline.",
    tools: "AI Agent trong VS Code (góp ý cấu trúc tài liệu context).",
    criteria: "Context mô tả rõ stack công nghệ (Postgres, Python) và mục tiêu khóa luận.",
    risk: "Context quá dài khiến AI Agent bị tràn token hoặc quên hướng dẫn cũ.",
    prev: "A1", next: "B1"
},
"B1": {
    stage: "Giai đoạn B", title: "B1: Phân tích nghiệp vụ tín dụng",
    obj: "Hiểu rõ vòng đời thực tế của khoản vay tại QTDND (Hình thành, giải ngân, thu nợ, dư nợ, nhóm nợ).",
    in: "Tài liệu quy trình nghiệp vụ QTDND thuộc Co-opBank.", out: "Tài liệu nghiệp vụ (sơ đồ state machine, quy tắc chuyển nhóm nợ).",
    tools: "NotebookLM (Hỏi đáp, tóm tắt quy định nghiệp vụ tín dụng Co-opBank).",
    criteria: "Vẽ được sơ đồ chuyển đổi trạng thái khoản vay đầy đủ các case chuẩn và rủi ro.",
    risk: "Hiểu sai khái niệm 'Dư nợ gốc' và 'Dư nợ tính lãi' dẫn đến lệch logic sau này.",
    prev: "A2", next: "B2"
},
"B2": {
    stage: "Giai đoạn B", title: "B2: Xác định yêu cầu báo cáo và KPI sơ bộ",
    obj: "Chốt danh sách các chỉ số cần đo lường (KPI) và các chiều phân tích (Dimension).",
    in: "Tài liệu nghiệp vụ (B1).", out: "Danh sách KPI (Dư nợ, Nợ xấu, Giải ngân...) kèm công thức và chiều phân tích (Chi nhánh, SP, Thời gian, Nhóm nợ).",
    tools: "Perplexity (Tìm kiếm mẫu dashboard tín dụng ngân hàng), NotebookLM.",
    criteria: "Mỗi KPI phải có công thức tính toán rõ ràng bằng lời.",
    risk: "Đưa ra KPI quá phức tạp nhưng không có ý nghĩa thiết thực cho QTDND.",
    prev: "B1", next: "B3"
},
"B3": {
    stage: "Giai đoạn B", title: "B3: Mapping KPI -> Trường dữ liệu -> Nguồn",
    obj: "Liên kết KPI với các sự kiện nghiệp vụ và thực thể dữ liệu cần có để tính toán.",
    in: "Danh sách KPI có công thức (B2).", out: "Bảng ma trận: [Tên KPI] - [Trường dữ liệu cần] - [Bảng/Thực thể dự kiến chứa].",
    tools: "Claude / ChatGPT (Phân tích, bóc tách thực thể từ công thức).",
    criteria: "100% KPI đã chốt đều map được về các trường dữ liệu cụ thể (ví dụ: SoDuGoc, NgayGiaiNgan).",
    risk: "Bỏ sót các bảng lịch sử (SCD - Slowly Changing Dimension) như lịch sử đổi nhóm nợ.",
    prev: "B2", next: "C1"
},
"C1": {
    stage: "Giai đoạn C", title: "C1: Thiết kế ERD mức khái niệm",
    obj: "Xây dựng mô hình quan hệ các thực thể nghiệp vụ cốt lõi (Khách hàng, Khoản vay, Hợp đồng, Giao dịch).",
    in: "Ma trận mapping KPI (B3).", out: "Sơ đồ ERD khái niệm (Conceptual) đã duyệt.",
    tools: "Claude (Phản biện thiết kế CSDL quan hệ, gợi ý chuẩn hóa 3NF).",
    criteria: "Đủ thực thể mô phỏng Core Banking tối giản, không bị lặp dữ liệu dư thừa.",
    risk: "Thiết kế thực thể Giao dịch không tách bạch giữa Giao dịch giải ngân và Giao dịch thu nợ.",
    prev: "B3", next: "C2"
},
"C2": {
    stage: "Giai đoạn C", title: "C2: Thiết kế ERD mức logic và DDL PostgreSQL",
    obj: "Chuyển đổi ERD khái niệm thành câu lệnh tạo bảng vật lý (DDL) trên schema 'core_banking'.",
    in: "ERD khái niệm (C1).", out: "Script SQL (DDL) tạo CSDL core_banking hoàn chỉnh với PK, FK.",
    tools: "AI Agent trong VS Code (Sinh code DDL), Claude.",
    criteria: "Chạy file DDL trên PostgreSQL không báo lỗi, các khóa ngoại (FK) liên kết chuẩn.",
    risk: "Chọn sai kiểu dữ liệu (ví dụ dùng INT cho số tiền thay vì DECIMAL/NUMERIC).",
    prev: "C1", next: "C3"
},
"C3": {
    stage: "Giai đoạn C", title: "C3: Tìm và sinh dữ liệu mô phỏng bằng Python",
    obj: "Tạo ra bộ dữ liệu mock lớn (hàng ngàn khoản vay) phản ánh đúng tỷ lệ nợ xấu, phân bổ theo thời gian.",
    in: "Cấu trúc CSDL core_banking (C2).", out: "Dữ liệu mô phỏng được insert vào DB (bằng Python Faker/Pandas).",
    tools: "AI Agent trong VS Code (Viết code Python sinh data hàng loạt).",
    criteria: "Dữ liệu sinh ra không vi phạm ràng buộc FK, tính logic hợp lý (ví dụ: ngày tất toán >= ngày giải ngân).",
    risk: "Dữ liệu sinh ngẫu nhiên hoàn toàn, không tạo ra được vòng đời khoản vay thực tế (ví dụ giải ngân nhưng không sinh giao dịch thu nợ).",
    prev: "C2", next: "C4"
},
"C4": {
    stage: "Giai đoạn C", title: "C4: Cổng kiểm tra dữ liệu", isGate: true,
    obj: "Xác minh xem dữ liệu sinh ra đã đủ để tính toàn bộ các KPI ở B2 chưa.",
    in: "DB core_banking có dữ liệu (C3), Yêu cầu KPI (B2).", out: "Quyết định chuyển giai đoạn hoặc quay lại sửa đổi.",
    tools: "AI Agent (Hỗ trợ viết các câu query test nhanh trên PostgreSQL).",
    criteria: "Mỗi KPI đều có ít nhất 1 câu truy vấn SQL viết tay tính ra được con số có ý nghĩa từ DB gốc.",
    risk: "Chủ quan chỉ test lượng nhỏ, khi load toàn bộ phát hiện thiếu logic lịch sử.",
    pass: "Dữ liệu đủ -> Tiếp tục sang D1 (Thiết kế Data Mart).",
    fail: "Thiếu dữ liệu -> Về C3 sinh thêm.<br>Thiếu trường -> Về C2 sửa DDL.<br>Bất khả thi -> Về B2 gạch bỏ KPI.",
    prev: "C3", next: "D1 (Nếu đạt)"
},
"D1": {
    stage: "Giai đoạn D", title: "D1: Xác định grain",
    obj: "Xác định hạt dữ liệu (Grain) cho bảng Fact trong Data Mart (ví dụ: Từng khoản vay, hay từng giao dịch hàng ngày?).",
    in: "Dữ liệu mô phỏng (C4).", out: "Tài liệu thống nhất grain mức chi tiết nhất.",
    tools: "Claude (Tư vấn Kimball methodology, so sánh Transaction Fact vs Snapshot Fact).",
    criteria: "Grain phải trả lời được toàn bộ KPI mà không cần join ngược về hệ thống nguồn.",
    risk: "Chọn grain quá mơ hồ (ví dụ tổng dư nợ theo ngày) làm mất khả năng khoan sâu (drill-down) theo khách hàng.",
    prev: "C4", next: "D2"
},
"D2": {
    stage: "Giai đoạn D", title: "D2: Xác định bảng Fact và Dimension",
    obj: "Bóc tách các chiều phân tích (Dim Khách hàng, SP, Thời gian) và bảng Sự kiện (Fact Giao dịch, Fact Số dư cuối ngày).",
    in: "Tài liệu grain (D1).", out: "Danh sách các bảng Fact/Dim chi tiết.",
    tools: "Claude (Phân tích chuẩn Star Schema).",
    criteria: "Tách bạch rõ ràng thuộc tính mô tả (vào Dim) và số liệu đo lường (vào Fact).",
    risk: "Thiết kế nhầm thuộc tính biến đổi theo thời gian (ví dụ Nhóm nợ) vào bảng Dim cố định thay vì xử lý SCD2 hoặc Fact.",
    prev: "D1", next: "D3"
},
"D3": {
    stage: "Giai đoạn D", title: "D3: Thiết kế Star Schema và DDL Data Mart",
    obj: "Triển khai cấu trúc Star Schema vào PostgreSQL (schema data mart, staging).",
    in: "Danh sách Fact/Dim (D2).", out: "Script SQL (DDL) khởi tạo Data Mart.",
    tools: "AI Agent trong VS Code (Sinh code tạo bảng Star Schema).",
    criteria: "Cấu trúc bảng tuân thủ chặt chẽ kiến trúc Star Schema (Fact chứa Surrogate Key tham chiếu đến Dim).",
    risk: "Quên tạo Surrogate Key (SK), tiếp tục dùng Business Key (PK gốc) làm khóa chính trong Data Mart.",
    prev: "D2", next: "E1"
},
"E1": {
    stage: "Giai đoạn E", title: "E1: Xây dựng ETL bằng Python",
    obj: "Viết script Python để Extract (từ core_banking), Transform (làm sạch, map Surrogate Key) và Load (vào dwh).",
    in: "Data gốc (C3), Cấu trúc Star Schema (D3).", out: "Dữ liệu được nạp thành công vào Data Mart.",
    tools: "AI Agent trong VS Code (Viết pandas/SQLAlchemy code xử lý ETL).",
    criteria: "Log ETL không có lỗi; bảng Fact/Dim có dữ liệu, Surrogate Key khớp hoàn hảo.",
    risk: "Logic Transform sai làm trùng lặp dòng trong Fact hoặc Null các khóa ngoại FK.",
    prev: "D3", next: "E2"
},
"E2": {
    stage: "Giai đoạn E", title: "E2: Xây dựng Dashboard Power BI",
    obj: "Kết nối Power BI vào PostgreSQL (Data Mart), xây dựng Semantic Model và viết DAX tạo Dashboard.",
    in: "Data Mart đã có dữ liệu (E1).", out: "Dashboard báo cáo tương tác trực quan hoàn chỉnh.",
    tools: "Gemini (Gợi ý cách viết các hàm DAX phức tạp như YTD, Time Intelligence).",
    criteria: "Giao diện sạch, các bộ lọc (Slicer) hoạt động đúng, measure DAX không bị chậm/lag.",
    risk: "Mô hình kết nối chéo (Many-to-Many) trong Power BI gây sai lệch số liệu khi filter.",
    prev: "E1", next: "E3"
},
"E3": {
    stage: "Giai đoạn E", title: "E3: Cổng kiểm thử đối chiếu", isGate: true,
    obj: "Kiểm tra tính chính xác của số liệu hiển thị trên Power BI so với dữ liệu gốc ban đầu.",
    in: "Báo cáo Power BI (E2), DB Core (C3).", out: "Xác nhận số liệu đúng (Pass) hoặc phát hiện sai lệch (Fail).",
    tools: "Gemini (So sánh tư duy chéo giữa truy vấn SQL và hàm DAX).",
    criteria: "Tổng dư nợ trên Power BI == Tổng dư nợ tính bằng query tay từ bảng gốc.",
    risk: "Báo cáo đẹp nhưng số liệu sai bét, dẫn đến mất độ tin cậy của sản phẩm khóa luận.",
    pass: "Khớp số liệu 100% -> Chuyển sang F1 hoàn thiện.",
    fail: "Lệch số -> Về E1 sửa ETL.<br>Lỗi mô hình -> Về D2 thiết kế lại Fact/Dim.<br>Tính sai -> Về E2 sửa DAX.",
    prev: "E2", next: "F1 (Nếu đạt)"
},
"F1": {
    stage: "Giai đoạn F", title: "F1: Hoàn thiện báo cáo, slide và demo",
    obj: "Đóng gói kết quả toàn bộ dự án thành quyển báo cáo khóa luận, slide thuyết trình bảo vệ và kịch bản demo.",
    in: "Kết quả kiểm thử đạt (E3).", out: "Tài liệu khóa luận bản cuối nộp cho Hội đồng.",
    tools: "Gemini (Chỉnh sửa văn phong học thuật, dàn ý slide).",
    criteria: "Báo cáo đúng form chuẩn của trường, slide nổi bật được công nghệ (Postgres, Python, Power BI), kịch bản demo trơn tru.",
    risk: "Code và Dashboard chạy tốt nhưng viết báo cáo sơ sài, không làm nổi bật được giá trị hệ thống.",
    prev: "E3", next: null
}
};

let completedNodes = new Set();
let activeNode = "A1";

// Pan Zoom State
let currentZoom = 1;
let panX = 0, panY = 0;
let isDragging = false;
let startX = 0, startY = 0;
const viewport = document.getElementById("viewport");
const scene = document.getElementById("scene");
const zoomText = document.getElementById("zoom-text");

function updateTransform() {
scene.setAttribute("transform", `matrix(${currentZoom} 0 0 ${currentZoom} ${panX} ${panY})`);
zoomText.textContent = `${Math.round(currentZoom * 100)}%`;
}
function adjustZoom(delta) {
const newZoom = Math.min(Math.max(0.5, currentZoom + delta), 2.5);
const rect = viewport.getBoundingClientRect();
const cx = rect.width / 2, cy = rect.height / 2;
panX = cx - (cx - panX) * (newZoom / currentZoom);
panY = cy - (cy - panY) * (newZoom / currentZoom);
currentZoom = newZoom;
updateTransform();
}
function resetView() { currentZoom = 1; panX = 0; panY = 0; updateTransform(); }

// Drag logic
viewport.addEventListener("pointerdown", (e) => {
if (e.target.closest(".state-node") || e.target.closest(".edge-pill") || e.target.closest(".link-node")) return;
isDragging = true; startX = e.clientX - panX; startY = e.clientY - panY;
viewport.setPointerCapture(e.pointerId);
});
viewport.addEventListener("pointermove", (e) => {
if (!isDragging) return;
panX = e.clientX - startX; panY = e.clientY - startY; updateTransform();
});
viewport.addEventListener("pointerup", (e) => {
if (isDragging) { isDragging = false; try { viewport.releasePointerCapture(e.pointerId); } catch(e){} }
});
viewport.addEventListener("wheel", (e) => {
e.preventDefault(); adjustZoom(e.deltaY < 0 ? 0.1 : -0.1);
}, { passive: false });

// Filtering
function setFilter(type) {
document.querySelectorAll(".filter-group .lumi-chip").forEach(c => c.classList.toggle("is-active", c.dataset.filter === type));
const edges = document.querySelectorAll(".transition-edge");
const nodes = document.querySelectorAll(".state-node");

edges.forEach(e => e.classList.remove("fade-out"));
nodes.forEach(n => n.classList.remove("fade-out"));

if (type === "main") {
    edges.forEach(e => { if(e.classList.contains("edge-loop")) e.classList.add("fade-out"); });
} else if (type === "loop") {
    edges.forEach(e => { if(e.classList.contains("edge-main")) e.classList.add("fade-out"); });
} else if (type.startsWith("stage-")) {
    nodes.forEach(n => { if(n.dataset.stage !== type) n.classList.add("fade-out"); });
    edges.forEach(e => { if(!e.dataset.stage.includes(type)) e.classList.add("fade-out"); });
}
}

// Interactivity
function selectState(id) {
activeNode = id;
document.querySelectorAll(".state-node").forEach(n => n.classList.remove("is-selected"));
document.getElementById(`node-${id}`).classList.add("is-selected");

const d = DATA[id];
document.getElementById("det-badge").textContent = d.stage;
document.getElementById("det-title").textContent = d.title;
document.getElementById("det-obj").textContent = "Mục tiêu: " + d.obj;
document.getElementById("det-in").textContent = d.in;
document.getElementById("det-out").textContent = d.out;
document.getElementById("det-tools").textContent = d.tools;
document.getElementById("det-criteria").textContent = d.criteria;
document.getElementById("det-risk").textContent = d.risk;

setupLink("det-prev", d.prev);
setupLink("det-next", d.next?.split(" ")[0]); // Strip extra text like "(Nếu đạt)"

// Checkbox state
document.getElementById("chk-complete").checked = completedNodes.has(id);

// Gate visibility
const gate = document.getElementById("gate-block");
if(d.isGate) {
    gate.style.display = "block";
    document.getElementById("det-pass").innerHTML = d.pass;
    document.getElementById("det-fail").innerHTML = d.fail;
} else {
    gate.style.display = "none";
}
}

function setupLink(elId, targetId) {
const el = document.getElementById(elId);
if (!targetId || !DATA[targetId]) {
    el.textContent = "-"; el.onclick = null; el.style.cursor = "default"; el.style.textDecoration = "none";
} else {
    el.textContent = targetId + ": " + DATA[targetId].title.split(":")[1].trim();
    el.style.cursor = "pointer"; el.style.textDecoration = "underline";
    el.onclick = () => selectState(targetId);
}
}

function selectEdge(edgeId, event) {
if(event) event.stopPropagation();
// Reset view to origin nodes based on edge name (e.g., A1-A2 -> select A1)
const fromId = edgeId.split("-")[0];
if (DATA[fromId]) selectState(fromId);
}

function toggleComplete() {
const chk = document.getElementById("chk-complete");
if (chk.checked) completedNodes.add(activeNode);
else completedNodes.delete(activeNode);

// Update SVG
document.getElementById(`node-${activeNode}`).classList.toggle("is-completed", chk.checked);
// Update counter
document.getElementById("progress-text").textContent = completedNodes.size;
}

// Init
selectState("A1");

// Iframe auto-resize
(function autoResize() {
function notifyHeight() {
    const c = document.querySelector('.widget-container') || document.body;
    const h = Math.ceil(Math.max(c.getBoundingClientRect().bottom, c.scrollHeight));
    window.parent.postMessage({type: 'widget-resize', height: h}, '*');
}
window.addEventListener('load', () => setTimeout(notifyHeight, 150));
new ResizeObserver(notifyHeight).observe(document.querySelector('.widget-container') || document.body);
})();