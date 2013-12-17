import sets
import scan_set
import pymongo
import os

path = 'ids/'
setlist = os.listdir(path)


def getall(set):
    id = scan_set.scan_set(set)
    scan_set.write_ids(set, id)

mongo = pymongo.MongoClient()["magic"]
sets_l = mongo.sets.find()

for set in sets_l:
    set = set["gatherer"]
    s = set + '.txt'
    if s not in setlist:
        print "Getting " + set
        getall(set)

print "\n\nCompletely Finished........"
