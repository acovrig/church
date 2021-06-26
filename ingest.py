import os
import json
import requests
from tika import parser
import re

url = 'https://devgraph.thecovrigs.net/v1/graphql'

data = json.dumps({
	'query': """query MyQuery {
		events {
			chapters {
				info
				name
				ss
				t
				who
			}
			sprites {
				height
				interval
				url
				width
			}
			date
			fn
			id
			kind
			name
			pdf
			scripture
			sub
		}
	}""",
	'variables': {},
	'operationName': 'MyQuery',
})
ret = requests.post(
	url,
	data = data,
	headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'x-hasura-admin-secret': '',
	},
)
db = ret.json()['data']['events']

for f in os.scandir(os.path.join('public', 'pdf')):
	if f.is_file():
		date = f.name.replace('.pdf', '')
		fn = f.name.replace('.pdf', '_church.mp4')
		if f.name not in map(lambda x: x['pdf'], db):
			data = json.dumps({
				'query': """mutation MyMutation {
					insert_events(objects: {date: "%s", fn: "%s", kind: "church", name: "Church", pdf: "%s"}) {
						affected_rows
						returning {
							id
							date
							name
							kind
							fn
							pdf
							created_at
							updated_at
							chapters {
								id
								info
								name
								who
							}
						}
					}
				}""" % (date, fn, f.name),
				'variables': {},
				'operationName': 'MyMutation',
			})
			ret = requests.post(
				url,
				data = data,
				headers = {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'x-hasura-admin-secret': '',
				},
			)
			try:
				ret = ret.json()
				if ret['data']['insert_events']['affected_rows'] == 0:
					print(ret)
			except:
				print(ret.json())
			ret = ret.json()
			ret = ret.get('data', {}).get('insert_events', {}).get('returning', [])
			if len(ret) > 0:
				db.append(ret[0])

		existing_event = list(filter(lambda x: x['pdf'] == f.name, db))
		if len(existing_event) > 0:
			existing_event = existing_event[0]
			id = existing_event.get('id')
		else:
			existing_event = {'chapters': []}

		# parse PDF
		chapters = []
		announcements = []
		announcement = False

		raw = parser.from_file(os.path.join('public', 'pdf', f.name))
		for r in raw['content'].split("\n"):
			m = re.search(r'^(.*?)\s*\.{5,}\s*(.*$)', r)
			date_re = re.search(r'(\w* \d*, \d{4} \d*:\d{2} .\..\.)', r)
			ss_title_re = re.search(r'#(\d)* \u201C(.*?)\u201D', r)
			announcement_re = re.search(r'^\d+', r)
			i = 0
			if m:
				i = 1
				name = re.sub(r'[\u2018\u2019]', "'", re.sub(r'[\u201C\u201D]', '"', m.group(1))).strip()
				who = re.sub(r'[\u2018\u2019]', "'", re.sub(r'[\u201C\u201D]', '"', m.group(2))).strip()

				try:
					existing_chapters = list(filter(lambda x: x['name'] == name and x['who'] == who, existing_event['chapters']))
				except:
					print(existing_event)
					print(existing_event['chapters'])
				if len(existing_chapters) < 1:
					chapters.append({
						"event_id": id,
						"name": name,
						"who": who,
						"info": "",
						"ss": 0,
						"t": 0
					})
			elif date_re:
				print('date: ' + date_re.group(1))
				# try {
				#   console.log('parsing d', date_re[1]);
				#   let md = moment(date_re[1].replaceAll('.', ''), 'MMM D, YYYY hh:mm a').toISOString();
				#   console.log(md);

				#   vid.date = md;
				#   vid.fn = moment(md).format('YYYY-MM-DD') + '_' + this.kind + '.mp4';
				#   vid.sub = moment(md).format('YYYY-MM-DD') + '_' + this.kind + '.vtt';
				#   vid.pdf = moment(md).format('YYYY-MM-DD') + '.pdf';
				#   vid.sprite.url = moment(md).format('YYYY-MM-DD') + '_' + this.kind + '-sprite.jpg';

				# } catch(e) {
				#   console.error(e);
				# }
			elif ss_title_re:
				print('found ss: ' + ss_title_re.group(1) + ' - ' + ss_title_re.group(2))
				# if(this.kind == 'ss')
				#   this.name = ss_title_re[1] + ' - ' + ss_title_re[2];
			elif r.startswith('Church Announcements'):
				announcements = True
			else:
				if announcement:
					print('add announcement ' + r)
				else:
					if len(chapters) > 0 and chapters[-1].get('info') == '':
						chapters[-1]['info'] = re.sub(r'[\u2018\u2019]', "'", re.sub(r'[\u201C\u201D]', '"', r)).strip()
					                                                                                                                                                                                                                                                                

    #     } else if(announcements && r.startsWith('Standifer Gap SDA Church')) {
    #       announcements = false;
    #     } else if(announcements && announcement_re) {
    #       vid.announcements.push(r.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/^\d+\) +(.+?) ([A-Za-z0-9][a-z])/, '<strong>$1</strong> $2'))
    #     } else {
    #       if(announcements) {
    #         vid.announcements[vid.announcements.length - 1] = vid.announcements[vid.announcements.length - 1] + ' ' + r.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
    #         return;
    #       }
    #       let e = vid.chapters.pop();
    #       if(e == null || i > 1) {
    #         console.log(r);
    #         return null;
    #       }
    #       i += 1;
    #       if(e.info != '') {
    #         vid.chapters.push(e);
    #         return;
    #       }
    #       Object.assign(e, {"info": r.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')});
    #       vid.chapters.push(e);
    #     }
    #   });
    #   let chap = vid.chapters.pop();
    #   if(chap != null) {
    #     if(chap.info.toLowerCase().startsWith('livestream'))
    #       chap.info = '';
    #     vid.chapters.push(chap);
    #   }
    #   return vid;
    # }

		query = """mutation MyMutation {
				insert_chapters(objects: %s) {
					affected_rows
				}
			}""" % re.sub(r'"([a-zA-Z_-]+?)":', '\\1:', json.dumps(chapters))
		data = json.dumps({
			'query': query,
			'variables': {},
			'operationName': 'MyMutation',
		})

		ret = requests.post(
			url,
			data = data,
			headers = {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-hasura-admin-secret': '',
			},
		)
		print(ret.json())

		# break
