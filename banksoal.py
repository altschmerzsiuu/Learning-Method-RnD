from openpyxl import Workbook

# bikin workbook & sheet
wb = Workbook()
ws = wb.active
ws.title = "Bank Soal"

# header kolom
headers = ["Soal", "Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"]
ws.append(headers)

# isi 100 soal dummy
for i in range(1, 101):
    ws.append([
        f"Soal {i}: Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
        "Lorem ipsum pilihan A",
        "Lorem ipsum pilihan B",
        "Lorem ipsum pilihan C",
        "Lorem ipsum pilihan D",
    ])

# simpan file
wb.save("bank_soal.xlsx")

print("File bank_soal.xlsx berhasil dibuat!")
