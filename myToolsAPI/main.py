from flask import Flask, jsonify

app = Flask(__name__)
# cors = CORS(app)

@app.route("/")
def main():
    return "<p>Hello, World!</p>"

@app.route("/getNote",methods=['GET'])
def getNote():
    return jsonify(
        {
        "id":"0",

        "note":{
            "ar":{
                "icon":{
                    "name":"crown",
                    "color":"gold",
                    },
                "headerOne":f"شهر واحد مجانا",
                "headerTwo":f"استخدم كود",
                "headerThree":f"FREEMONTH",
                "content":f"عرض لفترة محدودة! استخدم الكود أعلاه واحصل على إشتراك الإصدار الذهبي لمدة شهر مجانًا 👑! اذهب لصفحة الإشتراكات واضغط على (كوبون التخفيض) لتحصيل الكود.",
                "button":{
                    "text": f"صفحة الإشتراكات",
                    "type":"link",
                    "action":"Paywall",
                    "link":"https://br19.me",
                        },
                },
            "en":{
                "icon":{
                    "name":"crown",
                    "color":"gold",
                    },
                "headerOne": "One-Month Free!",
                "headerTwo": "Use Bellow Code",
                "headerThree": "FREEMONTH",
                "content": "Limited time offer! Use above code and get a one-month free subscription to the Golden Version 👑! Go to the Paywall page and press on (Promo Code) to redeem the code.",
                "button": {
                    "text": "Paywall Page",
                    "type":"link",
                    "action":"Paywall",
                    "link":"https://br19.me",
                        },
                },
            }

        }
        )
