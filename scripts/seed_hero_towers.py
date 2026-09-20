import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.core.registry import RegistryStore
from src.identity.allocator import ULPIN3DAllocator
from src.simulation.building_gen import generate_mz1_hero_tower, generate_bz1_hero_tower
from src.ml.h3_delineation import H3Delineator

DB_PATH = os.environ.get('REGISTRY_DB_PATH', 'registry.db')

def seed_hero_towers():
    print(f'Connecting to registry: {DB_PATH}')
    store = RegistryStore(db_path=DB_PATH)
    allocator = ULPIN3DAllocator(store=store)

    print('[1/2] Allocating MZ-1 Mumbai Worli Hero Tower...')
    mz1_tower = generate_mz1_hero_tower()
    print(f'      Geo-anchor: {mz1_tower.geo_anchor}')
    print(f'      Volumes: {len(mz1_tower.volumes)}, Floors: {mz1_tower.floor_count}')
    mz1_results = H3Delineator.batch_allocate_building(
        allocator=allocator, parent_ulpin='MH2700010001AA',
        building_structure=mz1_tower, issuer_node_id='MH')
    print(f'      Allocated {len(mz1_results)} RIDs')

    print('[2/2] Allocating BZ-1 Bengaluru MG Road Hero Tower...')
    bz1_tower = generate_bz1_hero_tower()
    print(f'      Geo-anchor: {bz1_tower.geo_anchor}')
    print(f'      Volumes: {len(bz1_tower.volumes)}, Floors: {bz1_tower.floor_count}')
    bz1_results = H3Delineator.batch_allocate_building(
        allocator=allocator, parent_ulpin='KA2900020001BB',
        building_structure=bz1_tower, issuer_node_id='KA')
    print(f'      Allocated {len(bz1_results)} RIDs')

    total = len(mz1_results) + len(bz1_results)
    print(f'DONE: {total} RIDs allocated into {DB_PATH}')
    print('Mumbai:    GET /cover?bbox=72.81,18.98,-50,72.84,19.01,200&format=geojson_3d')
    print('Bengaluru: GET /cover?bbox=77.58,12.96,870,77.61,12.99,1000&format=geojson_3d')

if __name__ == '__main__':
    seed_hero_towers()
