# Ứng dụng theo dõi nhiệt độ sử dụng Web Socket
#### Lập trình mạng INT3304-1
## Thành viên
- Phạm Thanh Sơn - 21020027
- Trần Quang Tài - 21020028
- Phú Quốc Trung - 21020096
- Ngô Văn Tuân - 21020031
- Nguyễn Anh Tuấn - 20020219
## Bắt đầu
- Chạy file `WebSocketIotApplication.java`
- truy cập `http://localhost:8080/sensor.html` trên trình duyệt của bạn 
- giao diện truy cập:
    ![sensor](/asset/sensor.png)
    - Bạn có thể nhập vào phần `Enter Sensor Name` nếu chỉ muốn tạo 1 sensor.
    - Phần `Enter Sensor Name For Testing` phục vụ mục đích test tải của hệ thống, bạn nhập vào tên của sensor cùng với số lượng sensor mà bạn muốn tạo ở phần `Enter Quantity`.
    - Sau khi test với Cpu Ryzen 7 5800H cùng với 14gb ram, đây là kết quả:
        - Max connect 256
        - Respone < 125ms
- Sau khi kết nối, truy cập `http://localhost:8080/gateway.html` trên trình duyệt của bạn 
    ![gateway](/asset/gateway.png)
    - Thông tin nhiệt độ sẽ được tự động cập nhật sau mỗi 10 giây.
    - Có thể xem được thông tin các sensor đã kết nối và ngắt kết nối.
    - Có thể tương tác với phần bảng.

## Công nghệ sử dụng:
- WebSocket
- SpringBoot
- Stomp
- HTML/JS/CSS
- Máy chủ xử lý đồng thời đa luồng