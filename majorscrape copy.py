from bs4 import BeautifulSoup
import urllib3
import unicodedata
import certifi
import csv

url = "http://www.dmi.illinois.edu/stuenr/class/enrfa19.htm"

http = urllib3.PoolManager(cert_reqs='CERT_REQUIRED', ca_certs=certifi.where())
response = http.request('GET', url)
soup = BeautifulSoup(response.data, features="html.parser")

data = []

tables = soup.find_all('table', attrs={'class':'table'})
table_count = 0
for table in tables:
    if table_count < 1:
        table_count += 1
        continue
    table_body = table.find('tbody')
    rows = table_body.find_all('tr')
    row_count = 0
    for row in rows:
        if row_count < 1:
            row_count += 1
            continue
        cols = row.find_all('td')
        data_row = []
        col_count = 0
        for col in cols:
            if col_count < 4 or col_count == 5:
                col_count += 1
                continue
            if col_count == len(cols) - 1:
                break
            data_row.append(col.text)
            col_count += 1
        data.append(data_row)
        # unicodedata.normalize('NFKD', agestr).encode('ascii', 'ignore')

with open('majordata.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["MajorName", "Concentration", "Freshman", "Sophomore", "Junior", "Senior", "NdegUgrad", "TotalUgrad", "Grad1", "Grad2", "NdegGrad", "TotalGrad", "Professional", "TotalStudents"])
    writer.writerows(data)
