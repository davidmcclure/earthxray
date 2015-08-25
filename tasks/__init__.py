

from invoke import Collection
from tasks import countries


ns = Collection()
ns.add_collection(Collection.from_module(countries))
