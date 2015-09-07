

from invoke import Collection
from tasks import countries, states


ns = Collection()
ns.add_collection(Collection.from_module(countries))
ns.add_collection(Collection.from_module(states))
