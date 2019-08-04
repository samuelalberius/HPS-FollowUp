import os
import cgi, cgitb

def get_data():
    form = cgi.FieldStorage()
    id = form.getvalue('ID')
    print(id)

def main():
    get_data()

if __name__ == '__main__':
    main()
